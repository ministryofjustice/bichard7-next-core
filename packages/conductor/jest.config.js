/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  modulePathIgnorePatterns: ["dist"],
  preset: "ts-jest",
  testEnvironment: "node",
  testTimeout: 90000,
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest"
  }
}
