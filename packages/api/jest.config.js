/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  globalSetup: "<rootDir>/setupTests.ts",
  modulePathIgnorePatterns: ["dist"],
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest"
  }
}
