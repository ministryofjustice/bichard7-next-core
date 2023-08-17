module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  modulePathIgnorePatterns: ["node_modules", "build", "api"],
  moduleNameMapper: {
    "^(node_modules/.*)$": "<rootDir>/$1",
    "^(common|core)$": "<rootDir>/$1",
    "^(common|core)/(.*)": "<rootDir>/$1/$2"
  },
  // Run these files after jest has been
  // installed in the environment
  setupFilesAfterEnv: ["<rootDir>/scripts/jest.setup.ts"]
}
