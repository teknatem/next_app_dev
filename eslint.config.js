
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import boundariesPlugin from 'eslint-plugin-boundaries';
import importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default tseslint.config(
  {
    // Global ignores
    ignores: ['.next/', 'node_modules/', 'dist/', 'build/', 'postcss.config.cjs', 'scripts/test-cors.js'],
  },

  // Base configs
  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    // General settings for all files
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
        'import/resolver': {
            typescript: {
                project: path.resolve(__dirname, './tsconfig.json'),
            },
        },
    }
  },

  {
    // React specific config
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  {
    // Next.js specific config
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },

  {
    // Custom import and boundaries rules
    plugins: {
      import: importPlugin,
      boundaries: boundariesPlugin,
    },
    rules: {
      'import/no-cycle': 'error',
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
          pathGroups: [
            { pattern: '@/**', group: 'internal' },
          ],
        },
      ],
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            { from: ['app'], allow: ['widgets', 'features', 'entities', 'shared'] },
            { from: ['widgets'], allow: ['features', 'entities', 'shared'] },
            { from: ['features'], allow: ['entities', 'shared'] },
            { from: ['entities'], allow: ['shared'] },
            { from: ['shared'], allow: ['shared'] },
            { from: ['domains'], allow: ['shared'] },
          ],
        },
      ],
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: path.resolve(__dirname, './tsconfig.json'),
        },
        alias: {
          map: [['@', './']],
          extensions: ['.ts', '.tsx', '.js', '.jsx'],
        },
      },
      'boundaries/elements': [
        {
          type: 'app',
          pattern: 'app/**',
        },
        {
          type: 'widgets',
          pattern: 'widgets/**',
        },
        {
          type: 'features',
          pattern: 'features/**',
        },
        {
          type: 'entities',
          pattern: 'entities/**',
        },
        {
          type: 'shared',
          pattern: 'shared/**',
        },
        {
          type: 'domains',
          pattern: 'domains/**',
        },
      ],
    },
  },
); 