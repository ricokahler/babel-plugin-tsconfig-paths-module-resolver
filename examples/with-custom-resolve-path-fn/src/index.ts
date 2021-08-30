import a from '@/bar/a';
import b from '@/foo/b';
import c from '@/baz/c';
// @ts-expect-error
import d from 'needs-a-custom-resolver';

export default [a, b, c, d];
