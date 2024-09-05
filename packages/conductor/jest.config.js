/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testTimeout: 90000,
  modulePathIgnorePatterns: ["dist"],
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest"
  }
}
