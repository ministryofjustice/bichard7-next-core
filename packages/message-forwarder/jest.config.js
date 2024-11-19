/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  modulePathIgnorePatterns: ["dist"],
  preset: "ts-jest",
  testEnvironment: "node",
  testTimeout: 60000
}
