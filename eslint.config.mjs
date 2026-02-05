import { fixupPluginRules } from "@eslint/compat"
import { FlatCompat } from "@eslint/eslintrc"
import js from "@eslint/js"
import typescriptEslint from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"
import esImport from "eslint-plugin-import"
import jest from "eslint-plugin-jest"
import mocha from "eslint-plugin-mocha"
import perfectionist from "eslint-plugin-perfectionist"
import nextPlugin from "@next/eslint-plugin-next"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})

const createPackageConfig = (packageName, overrides = {}) => ({
  files: [`packages/${packageName}/**/*`],
  languageOptions: {
    parserOptions: {
      project: `./packages/${packageName}/tsconfig.json`,
      tsconfigRootDir: __dirname
    }
  },
  ...overrides
})

const nextPackages = ["ui", "user-service"]
const nextJsTsxRules = {
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
      "packages/ui/next.config.js",
      "packages/ui/.next/*",
      "packages/user-service/.next/*",
      "packages/user-service/cypress.config.js",
      "packages/user-service/next.config.js"
    ]
  },
  {
    languageOptions: {
      globals: {},
      ecmaVersion: "latest",
      sourceType: "module",

      parserOptions: {
        project: ["./tsconfig.json", "./packages/*/tsconfig.json", "./packages/*/cypress/tsconfig.json"]
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
      "plugin:@typescript-eslint/strict",
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
      "@typescript-eslint/no-invalid-void-type": "off",
      "@typescript-eslint/no-dynamic-delete": "off",

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
    files: ["packages/core/**/*", "packages/common/schemas/*"],

    rules: {
      "perfectionist/sort-objects": "off"
    }
  },
  {
    files: ["packages/api/**/*.ts", "packages/user-service/testFixtures/**/*.js"],

    rules: {
      "require-await": "off"
    }
  },
  {
    files: nextPackages.flatMap((pkg) => [`packages/${pkg}/**/*`]),
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
    },
  },
  // ...compat.extends("plugin:@next/next/recommended").map((config) => ({
  //   ...config,
  //   files: nextPackages.flatMap((pkg) => [`packages/${pkg}/**/*`])
  // })),
  // Apply tsconfig for Next.js packages
  ...nextPackages.map((pkg) => createPackageConfig(pkg)),
  ...compat.extends("prettier", "plugin:prettier/recommended").map((config) => ({
    ...config,
    files: nextPackages.flatMap((pkg) => [`packages/${pkg}/**/*.js`])
  })),
  {
    files: nextPackages.flatMap((pkg) => [`packages/${pkg}/**/*.js`]),

    rules: {
      "@typescript-eslint/no-var-requires": "off",
      curly: ["error", "all"],
      "no-useless-escape": "off",
      "import/no-import-module-exports": "off"
    }
  },
  {
    files: nextPackages.flatMap((pkg) => [`packages/${pkg}/**/*.ts`]),

    rules: {
      "require-await": "off",
      "jest/no-conditional-expect": "off"
    }
  },
  ...compat
    .extends("next", "plugin:@typescript-eslint/strict", "plugin:jsx-a11y/recommended", "plugin:prettier/recommended")
    .map((config) => ({
      ...config,
      files: nextPackages.flatMap((pkg) => [`packages/${pkg}/**/*.tsx`]),
      languageOptions: {
        ...config.languageOptions,
        parser: tsParser
      }
    })),
  // TSX configs for Next.js packages
  ...nextPackages.map((pkg) => ({
    files: [`packages/${pkg}/**/*.tsx`],
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
        project: `./packages/${pkg}/tsconfig.json`,
        tsconfigRootDir: __dirname
      }
    },
    rules: nextJsTsxRules
  })),
  {
    files: nextPackages.flatMap((pkg) => [
      `packages/${pkg}/**/_*.ts`,
      `packages/${pkg}/**/_*.tsx`,
      `packages/${pkg}/src/pages/**/*.ts`,
      `packages/${pkg}/src/pages/**/*.tsx`,
      `packages/${pkg}/**/*.config.js`,
      `packages/${pkg}/**/*.config.ts`,
      `packages/${pkg}/test/helpers/**/*.ts`,
      `packages/${pkg}/cypress/**/*.ts`
    ]),

    languageOptions: {
      parser: tsParser
    },

    rules: {
      "import/no-extraneous-dependencies": "off"
    }
  },
  {
    files: nextPackages.flatMap((pkg) => [`packages/${pkg}/**/*.test.*`]),

    rules: {
      "@typescript-eslint/no-explicit-any": "off"
    }
  },
  ...compat.extends("plugin:cypress/recommended").map((config) => ({
    ...config,
    files: nextPackages.flatMap((pkg) => [`packages/${pkg}/cypress/**/*`])
  })),
  {
    files: nextPackages.flatMap((pkg) => [`packages/${pkg}/cypress/**/*`]),

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
    files: nextPackages.flatMap((pkg) => [`packages/${pkg}/.ncurc.js`]),

    rules: {
      "no-console": "off"
    }
  },
  {
    files: nextPackages.flatMap((pkg) => [`packages/${pkg}/next-env.d.ts`]),
    rules: {
      "@typescript-eslint/triple-slash-reference": "off"
    }
  }
]
