import { babelPluginTsconfigPathsModuleResolver } from "./babel-plugin-tsconfig-paths-module-resolver";

const mockManipulateOptions = jest.fn(function (this: any, ...args) {
  return {
    mockManipulateOptionsResults: true,
    thisValue: this,
    args,
  };
});

const mockPre = jest.fn(function (this: any, ...args) {
  return {
    mockPre: true,
    thisValue: this,
    args,
  };
});

jest.mock("babel-plugin-module-resolver", () =>
  jest.fn((...args) => ({
    args,
    extraOption: true,
    manipulateOptions: mockManipulateOptions,
    pre: mockPre,
  }))
);

describe("babelPluginTsconfigPathsModuleResolver", () => {
  it("returns a pre-configured version of babel-plugin-module-resolve", () => {
    const mockArgs = { mockArgs: true };
    const result = babelPluginTsconfigPathsModuleResolver(mockArgs);

    expect(result).toMatchInlineSnapshot(`
      Object {
        "args": Array [
          Object {
            "mockArgs": true,
          },
        ],
        "extraOption": true,
        "manipulateOptions": [Function],
        "name": "tsconfig-paths-module-resolver",
        "pre": [Function],
      }
    `);

    const mockThis = { mockThis: true } as any;
    const mockFile = { mockFile: true } as any;

    result.manipulateOptions?.call(mockThis, { arg1: true }, { arg2: true });
    result.pre?.call(mockThis, mockFile);

    expect(mockManipulateOptions.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "arg1": true,
          },
          Object {
            "arg2": true,
          },
        ],
      ]
    `);
    expect(mockPre.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "mockFile": true,
          },
        ],
      ]
    `);

    expect(mockThis).toMatchInlineSnapshot(`
      Object {
        "mockThis": true,
        "opts": Object {
          "extensions": Array [
            ".ts",
            ".tsx",
            ".js",
            ".jsx",
            ".es",
            ".es6",
            ".mjs",
          ],
          "resolvePath": [Function],
        },
      }
    `);
  });
});
