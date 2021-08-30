import { exec } from 'child_process';
import { promisify } from 'util';

const execute = promisify(exec);

jest.setTimeout(30 * 1000);

beforeAll(async () => {
  const build = await execute('npm run build');
  if (build.stderr) console.error(build.stderr);

  const buildExamples = await execute('npm run build-examples');
  if (buildExamples.stderr) console.error(buildExamples.stderr);
});

describe('examples', () => {
  test('standard', () => {
    const standard = jest.requireActual(
      '@babel-plugin-tsconfig-paths-module-resolver/standard',
    ).default;

    expect(standard).toMatchInlineSnapshot(`
      Array [
        "from src/bar/a",
        "from src/foo/b",
        "from umbrella/baz/c",
      ]
    `);
  });

  test('with-custom-resolve-path-fn', () => {
    const standard = jest.requireActual(
      '@babel-plugin-tsconfig-paths-module-resolver/with-custom-resolve-path-fn',
    ).default;

    expect(standard).toMatchInlineSnapshot(`
      Array [
        "from src/bar/a",
        "from src/foo/b",
        "from umbrella/baz/c",
        "from special",
      ]
    `);
  });
});
