module.exports = {
  apps: [
    {
      name: 'emis',
      script: './vet-seit.emis.ge/dist/apps/vet/server/server.mjs',
      env: {
        PORT: 4000
      },
    },
    {
      name: 'qwerty',
      script: './vet2-seit.emis.ge/dist/apps/vet/server/server.mjs',
      env: {
        PORT: 4001
      },
    },
  ],
};
