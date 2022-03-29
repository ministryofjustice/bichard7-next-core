module.exports = {
  root: true,
  env: {
    es6: true
  },
  rules: {
    semi: [2, "never"],
    quotes: [
      2,
      "double",
      {
        avoidEscape: true
      }
    ],
    "comma-dangle": "off"
  },
  ignorePatterns: ["build/*"],
  overrides: [
    {
      files: ["**/*.js"],
      extends: ["airbnb-base", "prettier", "plugin:prettier/recommended"],
      rules: {
        "@typescript-eslint/no-var-requires": "off",
        curly: [2, "all"]
      }
    },
    {
      files: ["**/*.ts"],
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint", "jest"],
      extends: [
        "airbnb-typescript/base",
        "plugin:@typescript-eslint/recommended",
        "plugin:jest/recommended",
        "plugin:jest/style",
        "prettier",
        "plugin:prettier/recommended"
      ],
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        project: "tsconfig.eslint.json",
        tsconfigRootDir: __dirname
      },
      rules: {
        "prettier/prettier": ["error"],
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/consistent-type-imports": ["error"],
        "@typescript-eslint/no-non-null-assertion": "off",
        "no-plusplus": "off",
        curly: [2, "all"],
        "require-await": "error",
        "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_$" }]
      }
    },
    {
      files: ["*.test.ts"],
      rules: {
        "@typescript-eslint/no-var-requires": "off",
        "import/first": "off",
        "import/no-extraneous-dependencies": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-explicit-any": "off"
      }
    },
    {
      files: ["tests/**/*.ts"],
      rules: {
        "import/no-extraneous-dependencies": "off"
      }
    }
  ]
}
