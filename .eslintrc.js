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
      extends: ["airbnb", "prettier", "plugin:prettier/recommended"],
      rules: {
        "@typescript-eslint/no-var-requires": "off",
        curly: [2, "all"]
      }
    },
    {
      files: ["**/*.ts", "**/*.tsx"],
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint", "jsx-a11y", "jest"],
      extends: [
        "airbnb-typescript",
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
        "require-await": "error"
      }
    },
    {
      files: ["*.test.ts"],
      rules: {
        "@typescript-eslint/no-var-requires": "off",
        "import/first": "off",
        "import/no-extraneous-dependencies": "off",
        "@typescript-eslint/no-non-null-assertion": "off"
      }
    },
    {
      files: ["characterisation-tests/**/*.ts"],
      rules: {
        "import/no-extraneous-dependencies": "off"
      }
    }
  ]
}
