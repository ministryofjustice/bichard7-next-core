module.exports = {
  parserOptions: {
    project: "./tsconfig.json"
  },
  overrides: [
    {
      files: ["**/*.ts"],
      rules: {
        "require-await": "off"
      }
    }
  ]
}
