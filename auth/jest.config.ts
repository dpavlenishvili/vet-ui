import 'jest-preset-angular';

export default {
  displayName: 'auth',
  preset: '../jest.preset.js',
  coverageDirectory: '../coverage/auth',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
};
