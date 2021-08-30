import { PluginObj, PluginPass } from '@babel/core';
import babelPluginModuleResolver, {
  BabelPluginModuleResolveOptions,
} from 'babel-plugin-module-resolver';
import { defaultExtensions } from './default-extensions';
import { createResolvePath } from './create-resolve-path';

interface State extends PluginPass {
  opts: BabelPluginModuleResolveOptions | false | undefined;
}

function babelPluginTsconfigPathsModuleResolver(
  ...args: any[]
): PluginObj<State> {
  const result = babelPluginModuleResolver(...args);

  function mutateThis(incomingThis: PluginPass): asserts incomingThis is State {
    const opts = (incomingThis.opts = incomingThis.opts || {}) as State;

    opts.extensions = opts.extensions || defaultExtensions;
    opts.resolvePath = opts.resolvePath || createResolvePath();
  }

  return {
    ...result,

    name: 'tsconfig-paths-module-resolver',

    ...(result?.manipulateOptions && {
      manipulateOptions(this: PluginPass, ...args) {
        mutateThis(this);
        return result.manipulateOptions?.call(this, ...args);
      },
    }),

    ...(result?.pre && {
      pre(...args) {
        mutateThis(this);
        return result.pre?.call(this, ...args);
      },
    }),
  };
}

babelPluginTsconfigPathsModuleResolver.createResolvePath = createResolvePath;

export { babelPluginTsconfigPathsModuleResolver };
