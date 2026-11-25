import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const globalRoot = process.execPath ? path.dirname(process.execPath) : '';
const searchPaths = [
  process.cwd(),
  path.join(globalRoot, 'node_modules'),
  path.join(globalRoot, 'lib', 'node_modules'),
];

const tseslint = require(
  require.resolve('typescript-eslint', { paths: searchPaths })
);

export default [
  {
    ignores: ['.next/**', 'node_modules/**', 'dist/**'],
  },
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },
];
