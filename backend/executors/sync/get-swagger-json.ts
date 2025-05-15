import { Tree } from '@nx/devkit';
import { Spec as SwaggerSchema } from 'swagger-schema-official';

export async function getSwaggerJson(tree: Tree, pathOrUrl: string): Promise<SwaggerSchema> {
  if (tree.exists(pathOrUrl)) {
    return JSON.parse(tree.read(pathOrUrl, 'utf-8'));
  }
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
  return fetch(pathOrUrl, {
    headers: {
      'content-type': 'application/json',
      'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
    },
    method: 'GET',
  })
    .then((res) => {
      return res.json() as Promise<SwaggerSchema>;
    })
    .catch((e) => {
      throw new Error('Could not fetch swagger.json');
    });
}
