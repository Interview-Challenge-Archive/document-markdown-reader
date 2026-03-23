import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: ['dist', 'coverage', 'node_modules', 'examples']
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    rules: {
      'no-undef': 'off'
    }
  },
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      globals: {
        process: 'readonly'
      }
    }
  },
  {
    files: ['test/**/*.ts'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        expect: 'readonly',
        it: 'readonly'
      }
    }
  }
)
