module.exports = {
  overrides: [
    {
      files: ["**/*.ts"],
      rules: {
        "require-await": "off"
      }
    }
  ],
  parserOptions: {
    project: "./tsconfig.json"
  }
}
