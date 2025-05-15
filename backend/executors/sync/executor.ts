import { ExecutorContext, formatFiles, names } from '@nx/devkit';
import { generateApi } from 'swagger-typescript-api';
import { Operation, Parameter, Spec as SwaggerSchema } from 'swagger-schema-official';
import { SyncExecutorSchema } from './schema';
import { flushChanges, FsTree, printChanges } from 'nx/src/generators/tree';
import { join } from 'path';
import { getSwaggerJson } from './get-swagger-json';

const paramRegex = /{\s*([^{}\s]*)\s*}/g;
const ignoredPaths = [/^\/error/, /^\/attachments(.*)/];

export default async function (options: SyncExecutorSchema, executorContext: ExecutorContext) {
  const tree = new FsTree(executorContext.root, executorContext.isVerbose);
  const swaggerJson = await getSwaggerJson(tree, options.openApiFilePath);
  swaggerJson.paths = Object.keys(swaggerJson.paths).reduce((acc: SwaggerSchema['paths'], path: string) => {
    const pathContent = swaggerJson.paths[path];
    if (ignoredPaths.some((p) => p.test(path))) {
      return acc;
    }
    Object.values(pathContent).forEach((methodSpecs) => {
      methodSpecs.operationId = methodSpecs.operationId.replace(/\d+$/, '');
    });
    if (paramRegex.test(path)) {
      path = path.replace(paramRegex, (match) => {
        return `{${names(match).propertyName}}`;
      });
      for (const method of Object.keys(pathContent)) {
        const methodSpecs = pathContent[method] as Operation;
        methodSpecs.parameters = methodSpecs.parameters.map((p: Parameter) => {
          if (p.in === 'path') {
            return {
              ...p,
              name: names(p.name).propertyName,
            };
          }
          return p;
        });
      }
    }
    acc[path] = pathContent;
    return acc;
  }, {});
  const generatedApi = await generateApi({
    spec: swaggerJson,
    modular: true,
    singleHttpClient: true,
    moduleNameFirstTag: true,
    templates: join(__dirname, 'templates'),
    hooks: {
      onCreateRouteName: (nameInfo) => {
        if (!nameInfo.duplicate) {
          nameInfo.original = nameInfo.original.replace(/\d+$/, '');
          nameInfo.usage = nameInfo.usage.replace(/\d+$/, '');
        }
      },
    },
  });
  const exportedFiles = [];
  tree.children(options.outputDir).forEach((file) => {
    tree.delete(file);
  });
  generatedApi.files.forEach(({ fileName, fileExtension, fileContent }) => {
    if (fileName === 'http-client') {
      return;
    }
    const fileNames = names(fileName);
    const newFilePath = `./${options.outputDir}/${fileNames.fileName}${fileExtension}`;
    tree.write(newFilePath, fileContent);
    exportedFiles.push(`./${fileNames.fileName}`);
  });
  const indexFilePath = `./${options.outputDir}/index.ts`;
  const indexFileContent = exportedFiles.map((file) => `export * from '${file}'`).join('\n');
  tree.write(indexFilePath, indexFileContent);
  await formatFiles(tree);
  const changes = tree.listChanges();
  flushChanges(tree.root, changes);
  printChanges(changes);
  return {
    success: true,
  };
}
