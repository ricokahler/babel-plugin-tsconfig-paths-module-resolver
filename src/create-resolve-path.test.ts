import {
  createMatchPath,
  loadConfig,
  ConfigLoaderFailResult,
  ConfigLoaderSuccessResult,
} from 'tsconfig-paths';
import { resolvePath as defaultResolvePath } from 'babel-plugin-module-resolver';
import { createResolvePath } from './create-resolve-path';

jest.mock('babel-plugin-module-resolver', () => ({
  resolvePath: jest.fn(() => 'from-default-babel-plugin-module-resolver'),
}));

jest.mock('tsconfig-paths', () => ({
  createMatchPath: jest.fn(),
  loadConfig: jest.fn(),
}));

const originalWarn = console.warn.bind(console);

beforeAll(() => {
  console.warn = jest.fn();
});

afterEach(() => {
  (console.warn as jest.Mock).mockClear();
});

afterAll(() => {
  console.warn = originalWarn;
});

describe('createResolvePath', () => {
  afterEach(() => {
    (loadConfig as jest.Mock).mockReset();
  });

  it('warns and uses the fallback resolve if loadConfig fails', () => {
    (loadConfig as jest.Mock).mockImplementation(() => {
      const result: ConfigLoaderFailResult = {
        resultType: 'failed',
        message: 'example message',
      };

      return result;
    });

    const resolvePath = createResolvePath();
    const result = resolvePath('./source-path', './current-file', {
      resolvePath: () => 'example result',
    });

    expect(result).toBe('example result');
    expect((console.warn as jest.Mock).mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "Failed to load tsconfig-paths: example message",
        ],
      ]
    `);
  });

  it('calls matchPatch in resolvePath if the loadConfig succeeds', () => {
    (loadConfig as jest.Mock).mockImplementation(() => {
      const result: ConfigLoaderSuccessResult = {
        resultType: 'success',
        absoluteBaseUrl: 'example absoluteBaseUrl',
        baseUrl: 'example baseUrl',
        configFileAbsolutePath: 'example configFileAbsolutePath',
        paths: {
          'example-paths': ['beep'],
        },
      };

      return result;
    });

    const mockMatchPath = jest.fn(() => './mock-match-path-result');
    (createMatchPath as jest.Mock).mockImplementation(() => mockMatchPath);
    const mockResolvePath = jest.fn();

    const resolvePath = createResolvePath();
    const result = resolvePath('./source-path', './current-file', {
      resolvePath: mockResolvePath,
    });

    expect(console.warn).not.toHaveBeenCalled();
    expect(mockResolvePath).not.toHaveBeenCalled();

    expect((createMatchPath as jest.Mock).mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "example absoluteBaseUrl",
          Object {
            "example-paths": Array [
              "beep",
            ],
          },
        ],
      ]
    `);

    expect(result).toBe('./mock-match-path-result');
    expect(mockMatchPath.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "./source-path",
          undefined,
          undefined,
          Array [
            ".ts",
            ".tsx",
            ".js",
            ".jsx",
            ".es",
            ".es6",
            ".mjs",
          ],
        ],
      ]
    `);
  });

  it("falls back to the default resolve function if match path doesn't return anything", () => {
    (loadConfig as jest.Mock).mockImplementation(() => {
      const result: ConfigLoaderSuccessResult = {
        resultType: 'success',
        absoluteBaseUrl: 'example absoluteBaseUrl',
        baseUrl: 'example baseUrl',
        configFileAbsolutePath: 'example configFileAbsolutePath',
        paths: {
          'example-paths': ['beep'],
        },
      };

      return result;
    });

    const mockMatchPath = jest.fn(() => undefined);
    (createMatchPath as jest.Mock).mockImplementation(() => mockMatchPath);

    const resolvePath = createResolvePath();
    const result = resolvePath('./source-path', './current-file', {});

    expect(console.warn).not.toHaveBeenCalled();
    expect((defaultResolvePath as jest.Mock).mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "./source-path",
          "./current-file",
          Object {
            "_fromNested": true,
          },
        ],
      ]
    `);

    expect(createMatchPath).toHaveBeenCalled();
    expect(mockMatchPath).toHaveBeenCalled();

    expect(result).toBe('from-default-babel-plugin-module-resolver');
  });
});
