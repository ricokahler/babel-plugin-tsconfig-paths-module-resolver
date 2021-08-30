declare module 'babel-plugin-module-resolver' {
  import { PluginObj } from '@babel/core';

  export type ResolvePath = (
    sourcePath: string,
    currentFile: string,
    opts: BabelPluginModuleResolveOptions,
  ) => string;

  export interface BabelPluginModuleResolveOptions {
    /**
     * A string or an array of root directories. Specify the paths or a glob
     * path (eg. `./src/*.ts`). `node_modules` is an implicit root as it is a
     * default directory to resolve modules
     */
    root?: string | string[];
    /**
     * A map of alias. You can also alias `node_modules` dependencies, not just
     * local files.
     *
     * ### Regular expressions
     *
     * It is possible to specify an alias using a regular expression. To do
     * that, either start an alias with `'^'` or end it with `'$'`:
     *
     * ```json
     * {
     *   "plugins": [
     *     ["module-resolver", {
     *       "alias": {
     *         "^@namespace/foo-(.+)": "packages/\\1"
     *       }
     *     }]
     *   ]
     * }
     * ```
     *
     * ### Passing a substitute function
     *
     * If you need even more power over the aliased path, you can pass a function in the alias configuration:
     *
     * ```js
     * module.exports = {
     *   plugins: [
     *     ["module-resolver", {
     *       alias: {
     *         "foo": ([, name]) => `bar${name}`,
     *         "^@namespace/foo-(.+)": ([, name]) => `packages/${name}`
     *       }
     *     }]
     *   ]
     * }
     * ```
     *
     * Using the config from this example:
     * - `'foo'` will become `'bar'` (`name` is empty)
     * - `'foo/baz'` will become `'bar/baz'` (`name` includes the slash in this
     *   case)
     * - `'@namespace/foo-bar'` will become `'packages/bar'`
     *
     * The only argument is the result of calling `RegExp.prototype.exec` on the
     * matched path. It's an array with the matched string and all matched
     * groups.
     *
     * Because the function is only called when there is a match, the argument
     * can never be `null`.
     */
    alias?: Record<string, string | ((result: RegExpExecArray) => string)>;
    /**
     * An array of extensions used in the resolver.
     *
     * ```json
     * {
     *   "plugins": [
     *     [
     *       "module-resolver",
     *       {
     *         "extensions": [".js", ".jsx", ".es", ".es6", ".mjs"]
     *       }
     *     ]
     *   ]
     * }
     * ```
     */
    extensions?: string[];
    /**
     * An array of extensions that will be stripped from file paths. Defaults to
     * the `extensions` option value.
     *
     * ```json
     * {
     *   "plugins": [
     *     [
     *       "module-resolver",
     *       {
     *         "stripExtensions": [".js", ".jsx", ".es", ".es6", ".mjs"]
     *       }
     *     ]
     *   ]
     * }
     * ```
     */
    stripExtensions?: string[];
    /**
     * By default, the working directory is the one used for the resolver, but
     * you can override it for your project.
     * - The custom value `babelrc` will make the plugin look for the closest
     *   babelrc configuration based on the file to parse.
     *
     * ```json
     * {
     *   "plugins": [
     *     ["module-resolver", {
     *       "cwd": "babelrc"
     *     }]
     *   ]
     * }
     * ```
     *
     * - The custom value `packagejson` will make the plugin look for the
     *   closest `package.json` based on the file to parse.
     *
     * ```json
     * {
     *   "plugins": [
     *     ["module-resolver", {
     *       "cwd": "packagejson"
     *     }]
     *   ]
     * }
     * ```
     */
    cwd?: string;
    /**
     * Array of functions and methods that will have their first argument
     * transformed. By default those methods are: `require`, `require.resolve`,
     * `System.import`, `jest.genMockFromModule`, `jest.mock`, `jest.unmock`,
     * `jest.doMock`, `jest.dontMock`.
     *
     * ```json
     * {
     *   "plugins": [
     *     ["module-resolver", {
     *       "transformFunctions": [
     *           "require",
     *           "require.resolve",
     *           "System.import",
     *           "jest.genMockFromModule",
     *           "jest.mock",
     *           "jest.unmock",
     *           "jest.doMock",
     *           "jest.dontMock"
     *       ]
     *     }]
     *   ]
     * }
     * ```
     */
    transformFunctions?: string[];
    /**
     * A function that is called to resolve each path in the project. By default
     * `babel-plugin-module-resolver` is using an internal function - the same
     * one that's exported from the plugin itself (see [For plugin authors][0]
     * for more info).
     *
     * ```js
     * module.exports = {
     *   plugins: [
     *     ["module-resolver", {
     *       extensions: [".js"],
     *       resolvePath(sourcePath, currentFile, opts) {
     *          // The `opts` argument is the options object that is passed
     *          // through the Babel config.
     *          // opts = {
     *          //   extensions: [".js"],
     *          //   resolvePath: ...,
     *         return "resolvedPath";
     *       }
     *     }]
     *   ]
     * }
     * ```
     *
     * [0]: #TODO
     */
    resolvePath?: ResolvePath;
    /**
     * One of the [NPM log level options][0] to configure console logging during
     * build. Default is `"warn"`. Passing `"silent"` will disable all warnings
     * for path resolution failures.
     *
     * ```js
     * module.exports = {
     *   plugins: [
     *     ["module-resolver", {
     *       alias: {
     *         "dependency-string": "module-that-does-not-exist" // warning will not log
     *       },
     *       loglevel: 'silent'
     *     }]
     *   ]
     * }
     * ```
     *
     * [0]: https://docs.npmjs.com/misc/config#loglevel
     */
    logLevel?: string;
  }

  export const resolvePath: ResolvePath;
  export default function babelPluginModuleResolve(...args: any[]): PluginObj;
}
