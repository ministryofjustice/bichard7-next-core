module.exports = {
  parserOptions: {
    project: ["./tsconfig.json"]
  },
  overrides: [
    {
      files: ["**/*.js"],
      extends: ["airbnb", "prettier", "plugin:prettier/recommended"],
      rules: {
        "@typescript-eslint/no-var-requires": "off",
        curly: ["error", "all"],
        "no-useless-escape": "off",
        "import/no-import-module-exports": "off"
      }
    },
    {
      files: [
        "**/_*.{ts,tsx}",
        "src/{emails,pages}/**/*.{ts,tsx}",
        "*.config.{js,ts}",
        "test/helpers/**/*.ts",
        "cypress/**/*.ts"
      ],
      rules: {
        "filenames/match-exported": "off",
        "import/no-extraneous-dependencies": "off"
      }
    },
    {
      files: ["**/*.test.*"],
      rules: {
        "@typescript-eslint/no-explicit-any": "off"
      }
    },
    {
      files: ["cypress/**/*.ts", "cypress/**/*.tsx", "**/*.test.*"],
      extends: ["plugin:cypress/recommended"],
      rules: {
        "no-console": "off",
        "no-unused-expressions": "off",
        "@typescript-eslint/naming-convention": "off",
        "no-unused-vars": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "jest/expect-expect": "off"
      }
    },
    {
      files: [".ncurc.js"],
      rules: {
        "no-console": "off"
      }
    }
  ]
}
