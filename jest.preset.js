const nxPreset = require('@nx/jest/preset').default;
const angularJestPreset = require('jest-preset-angular/presets');
const esModules = [
  '@angular',
  'dayjs/esm',
];

const cjsPreset = angularJestPreset.createCjsPreset();

module.exports = {
  ...nxPreset,
  ...cjsPreset,
  moduleNameMapper: {
    '^lodash-es$': 'lodash',
  },
  transformIgnorePatterns: [
    `node_modules/(?!.*\\.mjs$|${esModules.join('|')})`,
  ]
};
