module.exports = {
  root: true,
  env: { es6: true },
  plugins: ["perfectionist"],
  extends: ["plugin:perfectionist/recommended-natural-legacy"],
  parserOptions: {
    project: ["./tsconfig.json", "./packages/*/tsconfig.json"]
  },
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
      excludedFiles: ["**/*.cy.ts", "packages/ui/scripts/utility/**/*.ts"],
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
        "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_+.*$", varsIgnorePattern: "^_+.*$" }],
        "import/no-extraneous-dependencies": ["off", { devDependencies: ["**/*.test.js"] }],
        // "@typescript-eslint/no-empty-object-type": "error",
        // "@typescript-eslint/consistent-type-imports": "error",
        "padding-line-between-statements": [
          "error",
          { blankLine: "always", prev: "block", next: "*" },
          { blankLine: "always", prev: "block-like", next: "*" }
        ],
        // TODO: Merge UI into Core
        "@typescript-eslint/no-empty-object-type": "off",
        "@typescript-eslint/no-require-imports": "off"
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
