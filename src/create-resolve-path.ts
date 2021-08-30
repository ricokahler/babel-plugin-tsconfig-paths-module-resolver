import path from 'path';
import { createMatchPath, loadConfig } from 'tsconfig-paths';
import {
  resolvePath as defaultResolvePath,
  ResolvePath,
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

  return function resolvePath(...args) {
    const [sourcePath, currentFile, opts] = args;
    const fallbackResolvePath = opts.resolvePath || defaultResolvePath;
    const extensions = opts.extensions || defaultExtensions;

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

      return fallbackResolvePath(...args);
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

    return fallbackResolvePath(...args);
  };
}
