
const setupPlugin = ({
  name: 'setup-environment',
  setup(build) {
    const define = (build.initialOptions.define ??= {});
    const processEnv = process.env;
    const buildVars = Object.entries(processEnv).reduce(
      (acc, [k, v]) => {
        acc[k] = v;
        return acc;
      },
      {}
    )
    define['BUILD_VARS'] = JSON.stringify(buildVars);
  }
});

export default setupPlugin;
