import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import vue from 'eslint-plugin-vue'
import importPlugin from 'eslint-plugin-import-x'
import vueParser from 'vue-eslint-parser'
import globals from 'globals'

// 配置import插件的路径解析
const importConfig = {
  plugins: {
    import: importPlugin
  },
  rules: {
    'import/no-unresolved': ['error', { ignore: ['^@/'] }],
    'import/named': 'error',
    'import/default': 'error',
    'import/namespace': 'error',
    'import/no-absolute-path': 'error',
    'import/no-dynamic-require': 'warn',
    'import/no-webpack-loader-syntax': 'error',
    'import/no-self-import': 'error',
    'import/no-cycle': 'warn',
    'import/no-useless-path-segments': 'warn',
    'import/no-relative-parent-imports': 'off',
    'import/first': 'error',
    'import/no-duplicates': 'error',
    'import/extensions': ['off', 'ignorePackages']
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
      node: {
        extensions: ['.js', '.ts', '.vue', '.json']
      },
      alias: {
        map: [
          ['@', './src']
        ],
        extensions: ['.js', '.ts', '.vue', '.json']
      }
    },
    'import/extensions': ['.js', '.ts', '.vue'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
      'vue-eslint-parser': ['.vue']
    }
  }
}

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  importConfig,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'import': importPlugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': 'off',
      'no-self-assign': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
  {
    files: ['**/*.vue'],
    plugins: {
      vue: vue,
      '@typescript-eslint': tseslint.plugin,
      'import': importPlugin,
    },
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-unused-vars': 'off',
      'no-unreachable': 'warn',
      'vue/html-indent': 'off',
      'vue/html-self-closing': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/no-multiple-template-root': 'off',
      'vue/no-v-model-argument': 'off',
    },
  },
  {
    rules: {
      indent: [
        'warn',
        2,
        {
          ignoredNodes: [
            'TemplateLiteral',
            'JSXElement',
            'JSXAttribute',
            'Comment',
          ],
          SwitchCase: 1,
        },
      ],
      semi: ['warn', 'never'],
      quotes: 'off',
    },
  },
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'public/**',
      '**/*.d.ts',
    ],
  },
]
