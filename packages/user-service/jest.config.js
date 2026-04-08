const { TextEncoder } = require("util")

/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  preset: "ts-jest",
  transform: {
    "\\.[jt]sx?$": "@swc/jest"
  },
  globals: {
    "ts-jest": {
      tsconfig: "test/tsconfig.json"
    },
    TextEncoder
  },
  moduleDirectories: ["node_modules", "<rootDir>/src"],
  testPathIgnorePatterns: ["/node_modules/", "/.next/", "/cypress"],
  transformIgnorePatterns: ["/node_modules/", "/.next/", "/cypress"],
  verbose: true
}

module.exports = config
