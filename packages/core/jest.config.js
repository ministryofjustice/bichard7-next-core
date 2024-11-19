/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  coveragePathIgnorePatterns: ["node_modules", "phase1/comparison", "phase1/tests"],
  moduleNameMapper: {
    "^(phase1|lib|types)$": "<rootDir>/$1",
    "^(phase1|lib|types)/(.*)": "<rootDir>/$1/$2"
  },
  modulePathIgnorePatterns: ["dist"],
  preset: "ts-jest",
  setupFilesAfterEnv: ["<rootDir>/phase1/tests/jest.setup.ts"],
  testEnvironment: "node",
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest"
  }
}
