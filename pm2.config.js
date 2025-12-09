module.exports = {
  apps: [
    {
      name: 'emis',
      script: './vet-seit.emis.ge/dist/apps/vet/server/server.mjs',
      env: {
        PORT: 4000,
        NODE_EXTRA_CA_CERTS: '/var/www/vet-seit.emis.ge/certs/internal-root-ca.crt'
      },
    },
    {
      name: 'qwerty',
      script: './vet2-seit.emis.ge/dist/apps/vet/server/server.mjs',
      env: {
        PORT: 4001,
        NODE_EXTRA_CA_CERTS: '/var/www/vet-seit.emis.ge/certs/internal-root-ca.crt'
      },
    },
  ],
};
