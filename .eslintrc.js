module.exports = {
  root: true,
  env: { es6: true },
  parserOptions: {
    project: ["./tsconfig.json", "./packages/*/tsconfig.json", "cypress/tsconfig.json"]
  },
  ignorePatterns: ["dist/*", "docs/*", "jest.setup.ts", "node_modules", "packages/*/dist/*"],
  overrides: [
    {
      // Plain JavaScript files
      files: ["**/*.js"],
      extends: ["airbnb-base", "prettier", "plugin:prettier/recommended"],
      rules: {
        curly: ["error", "all"],
        quotes: ["error", "double", { avoidEscape: true }],
        semi: ["error", "never"],
        "no-plusplus": "off",
        "require-await": "error",
        "prettier/prettier": ["error"]
      }
    },
    {
      // All TypeScript files
      // These settings will also affect test and script files
      files: ["**/*.ts"],
      excludedFiles: ["**/*.cy.ts"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: 2020
      },
      plugins: ["@typescript-eslint", "jest", "import"],
      extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:jest/recommended",
        "plugin:jest/style",
        "prettier",
        "plugin:prettier/recommended"
      ],
      rules: {
        curly: ["error", "all"],
        quotes: ["error", "double", { avoidEscape: true }],
        semi: ["error", "never"],
        "no-plusplus": "off",
        "require-await": "error",
        "prettier/prettier": ["error"],
        "@typescript-eslint/consistent-type-imports": ["error"],
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_+$", varsIgnorePattern: "^_+$" }],
        "import/no-extraneous-dependencies": ["off", { devDependencies: ["**/*.test.js"] }],
        "@typescript-eslint/ban-types": [
          "error",
          {
            extendDefaults: true,
            types: {
              "{}": false
            }
          }
        ],
        "padding-line-between-statements": [
          "error",
          { blankLine: "always", prev: "block", next: "*" },
          { blankLine: "always", prev: "block-like", next: "*" }
        ]
      }
    },
    {
      files: ["**/*.tsx"],
      extends: [
        "airbnb-typescript",
        "next",
        "plugin:@typescript-eslint/recommended",
        "plugin:jsx-a11y/recommended",
        "plugin:prettier/recommended"
      ],
      parserOptions: {
        parserOptions: {
          sourceType: "module"
        },
        ecmaVersion: 2020,
        project: ["tsconfig.json"]
      },
      plugins: ["@typescript-eslint", "filenames", "no-only-tests"],
      rules: {
        curly: ["error", "all"],
        "no-console": "off",
        "no-plusplus": "off",
        "no-useless-escape": "off",
        "require-await": "off",
        "filenames/match-exported": "error",
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
        "no-only-tests/no-only-tests": [
          "error",
          {
            block: ["test", "it", "assert"],
            focus: ["only", "focus"]
          }
        ]
      }
    },
    {
      // Just the TypeScript test files
      // These settings will only affect the tests
      files: ["*.test.ts"],
      rules: {
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "jest/no-standalone-expect": "off"
      }
    }
  ]
}
