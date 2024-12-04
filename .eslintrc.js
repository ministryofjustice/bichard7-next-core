module.exports = {
  env: { es6: true },
  ignorePatterns: [
    "dist/*",
    "docs/*",
    "jest.setup.ts",
    "node_modules",
    "packages/*/dist/*",
    "packages/ui/scripts/utility/*",
    "packages/ui/cypress.config.ts"
  ],
  overrides: [
    {
      extends: ["airbnb-base", "prettier", "plugin:prettier/recommended"],
      // Plain JavaScript files
      files: ["**/*.js"],
      rules: {
        curly: ["error", "all"],
        "no-plusplus": "off",
        "prettier/prettier": ["error"],
        quotes: ["error", "double", { avoidEscape: true }],
        "require-await": "error",
        semi: ["error", "never"]
      }
    },
    {
      excludedFiles: ["**/*.cy.ts", "packages/ui/scripts/utility/**/*.ts"],
      extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:jest/recommended",
        "plugin:jest/style",
        "prettier",
        "plugin:prettier/recommended"
      ],
      // All TypeScript files
      // These settings will also affect test and script files
      files: ["**/*.ts"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: 2020
      },
      plugins: ["@typescript-eslint", "jest", "import"],
      rules: {
        "@typescript-eslint/consistent-type-imports": ["error"],
        // TODO: Merge UI into Core
        "@typescript-eslint/no-empty-object-type": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-require-imports": "off",
        "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_+.*$", varsIgnorePattern: "^_+.*$" }],
        curly: ["error", "all"],
        "import/no-extraneous-dependencies": ["off", { devDependencies: ["**/*.test.js"] }],
        "no-plusplus": "off",
        // "@typescript-eslint/no-empty-object-type": "error",
        // "@typescript-eslint/consistent-type-imports": "error",
        "padding-line-between-statements": [
          "error",
          { blankLine: "always", next: "*", prev: "block" },
          { blankLine: "always", next: "*", prev: "block-like" }
        ],
        "prettier/prettier": ["error"],
        quotes: ["error", "double", { avoidEscape: true }],
        "require-await": "error",
        semi: ["error", "never"]
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
    },
    {
      extends: ["plugin:perfectionist/recommended-natural-legacy"],
      files: "packages/+(api|common|conductor)/**/*",
      plugins: ["perfectionist"]
    }
  ],
  parserOptions: {
    project: ["./tsconfig.json", "./packages/*/tsconfig.json"]
  },
  root: true
}
