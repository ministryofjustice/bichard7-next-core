/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  moduleNameMapper: {
    "^config$": "<rootDir>/src/config.ts",
    "^defaults$": "<rootDir>/src/defaults.ts",
    "^entities/(.*)$": "<rootDir>/src/entities/$1",
    "^lib/(.*)$": "<rootDir>/src/lib/$1",
    "^middleware/(.*)$": "<rootDir>/src/middleware/$1",
    "^services/(.*)$": "<rootDir>/src/services/$1",
    "^types/(.*)$": "<rootDir>/src/types/$1",
    "^utils(.*)$": "<rootDir>/src/utils/$1"
  },
  preset: "ts-jest",
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
  transform: {
    "^.+\\.(t|j)sx?$": [
      "@swc/jest",
      {
        jsc: {
          target: "es6"
        }
      }
    ]
  }
}
