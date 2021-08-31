# babel-plugin-tsconfig-paths-module-resolver

[![npm](https://badgen.net/npm/v/babel-plugin-tsconfig-paths-module-resolver)](https://www.npmjs.com/package/babel-plugin-tsconfig-paths-module-resolver) [![Github Actions](https://badgen.net/github/checks/ricokahler/babel-plugin-tsconfig-paths-module-resolver)](https://github.com/ricokahler/babel-plugin-tsconfig-paths-module-resolver/actions) [![codecov](https://codecov.io/gh/ricokahler/babel-plugin-tsconfig-paths-module-resolver/branch/main/graph/badge.svg?token=2cQuXwu8Gq)](https://codecov.io/gh/ricokahler/babel-plugin-tsconfig-paths-module-resolver) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

> Combines [`babel-plugin-module-resolver`][0] and [`tsconfig-paths`][1] to make a babel plugin that resolves [tsconfig paths][2].
>
> Use tsconfig-paths in any bundler that supports a custom babel config.

This library is a re-export of [`babel-plugin-module-resolver`](https://github.com/tleunen/babel-plugin-module-resolver) pre-configured with [tsconfig paths][2] support via the package [`tsconfig-paths`][1].

It aims to be stable by relying on these already widely-used packages to power the heavy logic:

| dependency                          | weekly downloads                                         |
| ----------------------------------- | -------------------------------------------------------- |
| [`babel-plugin-module-resolver`][0] | [![babel plugin module resolver weekly downloads][3]][4] |
| [`tsconfig-paths`][1]               | [![tsconfig-paths weekly downloads][5]][6]               |

These dependencies are automatically updated via [renovate bot](https://github.com/renovatebot/renovate) and [semantic release](https://github.com/semantic-release/semantic-release).

---

**How is this different from [`babel-plugin-tsconfig-paths`](https://github.com/Js-Brecht/babel-plugin-tsconfig-paths)?**

1. It does less — as stated above, this library depends on battled tested libs ([`tsconfig-paths`][1] and [`babel-plugin-module-resolver`][0]) to do the actual logic. The source code for this library is around ~100 SLOC which makes it easy to test and maintain.
2. It re-exports [`babel-plugin-module-resolver`][0] — giving you all the features of that babel plugin including [custom resolve functions](#resolvepath-and-createresolvepath).

---

## Installation

```
npm install --save-dev babel-plugin-tsconfig-paths-module-resolver
```

or

```
yarn add --dev babel-plugin-tsconfig-paths-module-resolver
```

Specify the plugin in your `.babelrc` (or [equivalent configuration file](https://babeljs.io/docs/en/config-files#configuration-file-types)).

```js
{
  "presets": [
    // ...
    "@babel/preset-typescript",
    // ...
  ],
  "plugins": [
    // add this to your babel config file in `plugins`
    // 👇👇👇
    "tsconfig-paths-module-resolver"
    // 👆👆👆
    // ...
  ]
}
```

That's it! [Paths from your tsconfig.json][2] should now work!

## Advanced usage

`babel-plugin-tsconfig-paths-module-resolver` accepts the same options as [`babel-plugin-module-resolver`](https://github.com/tleunen/babel-plugin-module-resolver/blob/master/DOCS.md).

You can supply those extra options in your babel configuration file like so:

```js
{
  "presets": [
    // ...
    "@babel/preset-typescript",
    // ...
  ],
  "plugins": [
    // ...
    [
      "tsconfig-paths-module-resolver",
      // add extra options here
      // 👇👇👇
      {
        // see here:
        // https://github.com/tleunen/babel-plugin-module-resolver/blob/master/DOCS.md
      }
      // 👆👆👆
    ]
  ]
};
```

### `resolvePath` and `createResolvePath`

[`babel-plugin-module-resolver`][0] includes [a configuration option](https://github.com/tleunen/babel-plugin-module-resolver/blob/master/DOCS.md#resolvepath) to allow you to programmatically resolve your imports.

This plugin provides a `resolvePath` implementation powered by [`tsconfig-paths`][1]. If you'd like to implement your own `resolvePath` implementation while still utilizing this plugin's default implementation, you can separately import `createResolvePath` that returns a `resolvePath` implementation.

```js
const createResolvePath = require('babel-plugin-tsconfig-paths-module-resolver/create-resolve-path');
const defaultResolvePath = createResolvePath();

/**
 * @param sourceFile {string} the input source path
 * @param currentFile {string} the absolute path of the current file
 * @param opts {any} the options as passed to the Babel config
 * @return {string}
 */
function customResolvePath(sourceFile, currentFile, opts) {
  // ...
  const result = defaultResolvePath(sourceFile, currentFile, opts);
  // ...

  return result;
}

// .babelrc.js
module.exports = {
  presets: [
    // ...
    '@babel/preset-typescript',
    // ...
  ],
  plugins: [
    // ...
    [
      'tsconfig-paths-module-resolver',
      {
        // 👇👇👇
        resolvePath: customResolvePath,
        // 👆👆👆
      },
    ],
  ],
};
```

[0]: https://github.com/tleunen/babel-plugin-module-resolver
[1]: https://github.com/dividab/tsconfig-paths
[2]: https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping
[3]: https://badgen.net/npm/dw/babel-plugin-module-resolver
[4]: https://www.npmjs.com/package/babel-plugin-module-resolver
[5]: https://badgen.net/npm/dw/tsconfig-paths
[6]: https://www.npmjs.com/package/tsconfig-paths
