import path from 'path';
import { createMatchPath, loadConfig } from 'tsconfig-paths';
import {
  resolvePath as defaultResolvePath,
  ResolvePath,
  BabelPluginModuleResolveOptions,
} from 'babel-plugin-module-resolver';
import { defaultExtensions } from './default-extensions';

export function createResolvePath(): ResolvePath {
  const configLoaderResult = loadConfig();

  const matchPath =
    configLoaderResult.resultType === 'success' &&
    createMatchPath(
      configLoaderResult.absoluteBaseUrl,
      configLoaderResult.paths,
    );

  return function resolvePath(sourcePath, currentFile, opts) {
    const fallbackResolvePath = (opts as any)._fromNested
      ? defaultResolvePath
      : opts.resolvePath || defaultResolvePath;

    const extensions = opts.extensions || defaultExtensions;
    const nextOpts = { ...opts, _fromNested: true };

    if (!matchPath) {
      if (opts.logLevel !== 'silent') {
        console.warn(
          `Failed to load tsconfig-paths: ${
            configLoaderResult.resultType === 'failed'
              ? configLoaderResult.message
              : 'Failed to create matchPath function. Please open an issue.'
          }`,
        );
      }

      return fallbackResolvePath(sourcePath, currentFile, nextOpts);
    }

    const matchPathResult = matchPath(
      sourcePath,
      undefined,
      undefined,
      extensions,
    );
    if (matchPathResult) {
      const relativePath = path.relative(
        path.dirname(currentFile),
        matchPathResult,
      );

      return relativePath.startsWith('./') ? relativePath : `./${relativePath}`;
    }

    return fallbackResolvePath(sourcePath, currentFile, nextOpts);
  };
}
