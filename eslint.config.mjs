import eslintConfigPrettier from 'eslint-config-prettier'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      '**/*.local',
      '**/.git/**',
      '**/pnpm-lock.yaml',
      // admin 子项目的 lint 由其自身的 .eslintrc.cjs 处理，root flat config 不覆盖
      'apps/admin/**',
    ],
  },

  // ── 后端 TypeScript（类型感知规则）───────────────────────────────
  {
    files: ['apps/backend/src/**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
        project: './apps/backend/tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
    },
  },

  // ── 其他 TypeScript / TSX（无类型信息）──────────────────────────
  {
    files: ['**/*.ts', '**/*.tsx'],
    ignores: ['apps/backend/src/**', 'apps/admin/**'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
    },
  },

  // ── 纯 JS / MJS / CJS ───────────────────────────────────────
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    ignores: ['apps/admin/**'],
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
    },
  },

  // ── prettier 规则 ─────────────────────────────────────────────
  eslintConfigPrettier,
]
