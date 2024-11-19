module.exports = {
  extends: ["plugin:@next/next/recommended"],
  overrides: [
    {
      extends: ["airbnb", "prettier", "plugin:prettier/recommended"],
      files: ["**/*.js"],
      rules: {
        "@typescript-eslint/no-var-requires": "off",
        curly: ["error", "all"],
        "import/no-import-module-exports": "off",
        "no-useless-escape": "off"
      }
    },
    {
      files: ["**/*.ts"],
      rules: {
        // TODO: Merge UI into Core
        "jest/no-conditional-expect": "off",
        "require-await": "off"
      }
    },
    {
      extends: [
        "next",
        "plugin:@typescript-eslint/recommended",
        "plugin:jsx-a11y/recommended",
        "plugin:prettier/recommended"
      ],
      files: ["**/*.tsx"],
      parserOptions: {
        ecmaVersion: 2020,
        parserOptions: {
          sourceType: "module"
        },
        project: ["tsconfig.json"]
      },
      plugins: ["@typescript-eslint", "filenames"],
      rules: {
        "@next/next/no-html-link-for-pages": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/naming-convention": [
          "warn",
          {
            filter: {
              match: false,
              regex: "^_+$"
            },
            format: ["StrictPascalCase", "strictCamelCase", "UPPER_CASE"],
            leadingUnderscore: "allow",
            selector: "variableLike"
          }
        ],
        // TODO: Merge UI into Core
        "@typescript-eslint/no-duplicate-enum-values": "off",
        "@typescript-eslint/no-unused-vars": [
          "warn",
          {
            argsIgnorePattern: "^_+$",
            varsIgnorePattern: "^_+$"
          }
        ],
        curly: ["error", "all"],
        "filenames/match-exported": "error",
        "import/first": "error",
        "import/no-anonymous-default-export": "off",
        "import/no-cycle": "error",
        "import/prefer-default-export": "off",
        "no-console": "off",
        "no-plusplus": "off",
        "no-useless-escape": "off",
        "prettier/prettier": ["error"],
        "react/jsx-curly-brace-presence": [
          "error",
          {
            children: "always",
            props: "ignore"
          }
        ],
        "react/require-default-props": ["off"],
        "require-await": "off"
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
      parser: "@typescript-eslint/parser",
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
      extends: ["plugin:cypress/recommended"],
      files: ["cypress/**/*"],
      plugins: ["mocha"],
      rules: {
        "@typescript-eslint/naming-convention": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "jest/expect-expect": "off",
        "jest/valid-expect": "off",
        "mocha/no-exclusive-tests": "error",
        "no-console": "off",
        "no-unused-expressions": "off",
        "no-unused-vars": "off"
      }
    },
    {
      files: [".ncurc.js"],
      rules: {
        "no-console": "off"
      }
    }
  ],
  parserOptions: {
    project: ["./tsconfig.json"]
  }
}
