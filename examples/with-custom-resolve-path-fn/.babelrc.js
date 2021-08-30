const { createResolvePath } = require('../..');

const resolvePath = createResolvePath();

function customResolvePath(...args) {
  const [sourceFile] = args;

  if (sourceFile === 'needs-a-custom-resolver') return './special';
  return resolvePath(...args);
}

module.exports = {
  presets: [
    '@babel/preset-typescript',
    ['@babel/preset-env', { targets: { node: true } }],
  ],
  plugins: [
    [
      require.resolve('../..'),
      {
        resolvePath: customResolvePath,
      },
    ],
  ],
};
