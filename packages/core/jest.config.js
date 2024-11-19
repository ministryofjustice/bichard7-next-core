/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^(phase1|lib|types)$": "<rootDir>/$1",
    "^(phase1|lib|types)/(.*)": "<rootDir>/$1/$2"
  },
  setupFilesAfterEnv: ["<rootDir>/phase1/tests/jest.setup.ts"],
  modulePathIgnorePatterns: ["dist"],
  coveragePathIgnorePatterns: ["node_modules", "phase1/comparison", "phase1/tests"],
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest"
  }
}
