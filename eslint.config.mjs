import {defineConfig} from 'eslint/config';
import gtsConfig from 'gts/build/src/index.js';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default defineConfig([
  ...gtsConfig,
  {
    ignores: [
      'dist/',
      '**/node_modules/',
      'bin/',
      'tests/',
      'package-lock.json',
      'tsup.config.ts'
    ],
  },
  {
    files: ['profiles/**/*.js'],
    languageOptions: {
      globals: {
        process: 'readonly',
        console: 'readonly',
      },
    },
    rules: {
      'no-process-exit': 'off',
    },
  },
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {argsIgnorePattern: '^_', varsIgnorePattern: '^_'},
      ],
    },
    languageOptions: {
      parserOptions: {
        project: ['tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['src/**/*.d.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  }
]);