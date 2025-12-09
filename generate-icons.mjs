#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirPath = process.argv[2];
const destPath = process.argv[3];

if (!dirPath || !destPath) {
  console.error('Usage: ./script.js <path-to-svg-directory> <destination-directory>');
  process.exit(1);
}

if (!fs.existsSync(dirPath)) {
  console.error(`Source directory not found: ${dirPath}`);
  process.exit(1);
}

if (!fs.existsSync(destPath)) {
  fs.mkdirSync(destPath, { recursive: true });
}

const files = fs.readdirSync(dirPath);
const svgFiles = files.filter(f => f.endsWith('.svg'));

if (svgFiles.length === 0) {
  console.log('No SVG files found');
  process.exit(0);
}

const exports = [];

svgFiles.forEach(file => {
  const filePath = path.join(dirPath, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Strip <?xml tag
  content = content.replace(/<\?xml[^?]*\?>\s*/g, '');

  // Strip comments
  content = content.replace(/<!--[\s\S]*?-->/g, '');

  // Trim whitespace
  content = content.trim();

  // Extract viewBox
  const viewBoxMatch = content.match(/viewBox=["']([^"']+)["']/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24';

  // Generate variable name
  const baseName = path.basename(file, '.svg');
  const varName = baseName.replace(/[^a-zA-Z0-9]+/g, '_').toLowerCase();

  exports.push(varName);

  // Generate .ts file content
  const tsContent = `import { SVGIcon } from '@progress/kendo-svg-icons';

export const ${varName}: SVGIcon = {
  name: '${varName}',
  content: \`${content}\`,
  viewBox: '${viewBox}',
};
`;

  // Write to destination
  const tsFilePath = path.join(destPath, `${varName}.ts`);
  fs.writeFileSync(tsFilePath, tsContent);
  console.error(`Created ${tsFilePath}`);
});

// Update index.ts
const indexPath = path.join(destPath, 'index.ts');
let indexContent = '';

if (fs.existsSync(indexPath)) {
  indexContent = fs.readFileSync(indexPath, 'utf8');
}

exports.forEach(varName => {
  const exportLine = `export { ${varName} } from './${varName}.ts';\n`;
  if (!indexContent.includes(`export { ${varName} }`)) {
    indexContent += exportLine;
  }
});

fs.writeFileSync(indexPath, indexContent);
console.error(`Updated ${indexPath} with ${exports.length} exports`);
