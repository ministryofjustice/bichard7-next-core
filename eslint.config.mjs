import { fixupPluginRules } from "@eslint/compat"
import { FlatCompat } from "@eslint/eslintrc"
import js from "@eslint/js"
import typescriptEslint from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"
import esImport from "eslint-plugin-import"
import jest from "eslint-plugin-jest"
import mocha from "eslint-plugin-mocha"
import perfectionist from "eslint-plugin-perfectionist"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})

export default [
  {
    ignores: [
      "dist/*",
      "docs/*",
      "**/jest.setup.ts",
      "**/node_modules",
      "packages/*/build.js",
      "packages/*/build/*",
      "packages/*/dist/*",
      "packages/*/scripts/utility*",
      "packages/e2e-test/scripts",
      "packages/ui/cypress.config.ts",
      "packages/ui/next.config.js"
    ]
  },
  {
    languageOptions: {
      globals: {},
      ecmaVersion: 6,
      sourceType: "module",

      parserOptions: {
        project: ["./tsconfig.json", "./packages/*/tsconfig.json"]
      }
    }
  },
  ...compat.extends("prettier", "plugin:prettier/recommended").map((config) => ({
    ...config,
    files: ["**/*.js"]
  })),
  {
    files: ["**/*.js"],

    rules: {
      curly: ["error", "all"],
      "no-plusplus": "off",
      "prettier/prettier": ["error"],

      quotes: [
        "error",
        "double",
        {
          avoidEscape: true
        }
      ],

      "require-await": "error",
      semi: ["error", "never"]
    }
  },
  ...compat
    .extends(
      "plugin:@typescript-eslint/recommended",
      "plugin:jest/recommended",
      "plugin:jest/style",
      "prettier",
      "plugin:prettier/recommended"
    )
    .map((config) => ({
      ...config,
      files: ["**/*.ts"],
      ignores: ["**/*.cy.ts", "packages/ui/scripts/utility/**/*.ts"]
    })),
  {
    files: ["**/*.ts"],
    ignores: ["**/*.cy.ts", "packages/ui/scripts/utility/**/*.ts"],

    plugins: {
      "@typescript-eslint": typescriptEslint,
      jest,
      import: fixupPluginRules(esImport)
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: "script"
    },

    rules: {
      "@typescript-eslint/consistent-type-imports": ["error"],
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-require-imports": "off",

      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_+.*$",
          varsIgnorePattern: "^_+.*$"
        }
      ],

      curly: ["error", "all"],

      "import/no-extraneous-dependencies": [
        "off",
        {
          devDependencies: ["**/*.test.js"]
        }
      ],

      "no-plusplus": "off",

      "padding-line-between-statements": [
        "error",
        {
          blankLine: "always",
          next: "*",
          prev: "block"
        },
        {
          blankLine: "always",
          next: "*",
          prev: "block-like"
        }
      ],

      "prettier/prettier": ["error"],

      quotes: [
        "error",
        "double",
        {
          avoidEscape: true
        }
      ],

      "require-await": "error",
      semi: ["error", "never"]
    }
  },
  {
    files: ["**/*.test.ts"],

    rules: {
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "jest/no-standalone-expect": "off"
    }
  },
  ...compat.extends("plugin:perfectionist/recommended-natural-legacy").map((config) => ({
    ...config,
    files: ["packages/+(api|common|conductor|core)/**/*"]
  })),
  {
    files: ["packages/+(api|common|conductor|core)/**/*"],

    plugins: {
      perfectionist
    }
  },
  {
    files: ["packages/core/**/*"],

    rules: {
      "perfectionist/sort-objects": "off"
    }
  },
  {
    files: ["packages/api/**/*.ts"],

    rules: {
      "require-await": "off"
    }
  },
  ...compat.extends("plugin:@next/next/recommended").map((config) => ({
    ...config,
    files: ["packages/ui/**/*"]
  })),
  {
    files: ["packages/ui/**/*"],

    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.json"]
      }
    }
  },
  ...compat.extends("prettier", "plugin:prettier/recommended").map((config) => ({
    ...config,
    files: ["packages/ui/**/*.js"]
  })),
  {
    files: ["packages/ui/**/*.js"],

    rules: {
      "@typescript-eslint/no-var-requires": "off",
      curly: ["error", "all"],
      "no-useless-escape": "off",
      "import/no-import-module-exports": "off"
    }
  },
  {
    files: ["packages/ui/**/*.ts"],

    rules: {
      "require-await": "off",
      "jest/no-conditional-expect": "off"
    }
  },
  ...compat
    .extends(
      "next",
      "plugin:@typescript-eslint/recommended",
      "plugin:jsx-a11y/recommended",
      "plugin:prettier/recommended"
    )
    .map((config) => ({
      ...config,
      files: ["packages/ui/**/*.tsx"]
    })),
  {
    files: ["packages/ui/**/*.tsx"],

    plugins: {
      "@typescript-eslint": typescriptEslint
    },

    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "script",

      parserOptions: {
        parserOptions: {
          sourceType: "module"
        },

        project: ["./tsconfig.json"]
      }
    },

    rules: {
      curly: ["error", "all"],
      "no-console": "off",
      "no-plusplus": "off",
      "no-useless-escape": "off",
      "require-await": "off",
      "import/first": "error",
      "import/no-cycle": "error",
      "import/no-anonymous-default-export": "off",
      "import/prefer-default-export": "off",
      "prettier/prettier": ["error"],

      "react/jsx-curly-brace-presence": [
        "error",
        {
          props: "ignore",
          children: "always"
        }
      ],

      "react/require-default-props": ["off"],
      "@next/next/no-html-link-for-pages": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",

      "@typescript-eslint/naming-convention": [
        "warn",
        {
          selector: "variableLike",
          format: ["StrictPascalCase", "strictCamelCase", "UPPER_CASE"],

          filter: {
            regex: "^_+$",
            match: false
          },

          leadingUnderscore: "allow"
        }
      ],

      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_+$",
          varsIgnorePattern: "^_+$"
        }
      ],

      "@typescript-eslint/no-duplicate-enum-values": "off"
    }
  },
  {
    files: [
      "packages/ui/**/_*.{ts,tsx}",
      "packages/ui/src/{emails,pages}/**/*.{ts,tsx}",
      "packages/ui/**/*.config.{js,ts}",
      "packages/ui/test/helpers/**/*.ts",
      "packages/ui/cypress/**/*.ts"
    ],

    languageOptions: {
      parser: tsParser
    },

    rules: {
      "import/no-extraneous-dependencies": "off"
    }
  },
  {
    files: ["packages/ui/**/*.test.*"],

    rules: {
      "@typescript-eslint/no-explicit-any": "off"
    }
  },
  ...compat.extends("plugin:cypress/recommended").map((config) => ({
    ...config,
    files: ["packages/ui/cypress/**/*"]
  })),
  {
    files: ["packages/ui/cypress/**/*"],

    plugins: {
      mocha
    },

    rules: {
      "no-console": "off",
      "no-unused-expressions": "off",
      "@typescript-eslint/naming-convention": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "jest/expect-expect": "off",
      "jest/valid-expect": "off",
      "mocha/no-exclusive-tests": "error"
    }
  },
  {
    files: ["packages/ui/.ncurc.js"],

    rules: {
      "no-console": "off"
    }
  }
]
