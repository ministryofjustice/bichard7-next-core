/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
  moduleNameMapper: {
    "^defaults$": "<rootDir>/src/defaults.ts",
    "^config$": "<rootDir>/src/config.ts",
    "^types/(.*)$": "<rootDir>/src/types/$1",
    "^lib/(.*)$": "<rootDir>/src/lib/$1",
    "^utils(.*)$": "<rootDir>/src/utils/$1",
    "^entities/(.*)$": "<rootDir>/src/entities/$1",
    "^services/(.*)$": "<rootDir>/src/services/$1",
    "^middleware/(.*)$": "<rootDir>/src/middleware/$1"
  }
}
