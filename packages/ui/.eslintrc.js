module.exports = {
  extends: ["plugin:@next/next/recommended"],
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
      files: ["**/*.ts"],
      rules: {
        "require-await": "off",
        // TODO: Merge UI into Core
        "jest/no-conditional-expect": "off"
      }
    },
    {
      files: ["**/*.tsx"],
      extends: [
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
      plugins: ["@typescript-eslint", "filenames"],
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
        // TODO: Merge UI into Core
        "@typescript-eslint/no-duplicate-enum-values": "off"
      }
    },
    {
      parser: "@typescript-eslint/parser",
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
      files: ["cypress/**/*"],
      plugins: ["mocha"],
      extends: ["plugin:cypress/recommended"],
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
      files: [".ncurc.js"],
      rules: {
        "no-console": "off"
      }
    }
  ]
}
