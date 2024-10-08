/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  modulePathIgnorePatterns: ["dist"],
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest"
  },
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
    "^server/(.*)$": "<rootDir>/src/server/$1",
    "^services/(.*)$": "<rootDir>/src/services/$1",
    "^useCases/(.*)$": "<rootDir>/src/useCases/$1",
    "^tests/(.*)$": "<rootDir>/src/tests/$1"
  }
}
