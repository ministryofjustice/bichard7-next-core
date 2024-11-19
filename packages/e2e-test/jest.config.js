module.exports = {
  clearMocks: true,
  maxConcurrency: 1,
  maxWorkers: 1,
  preset: "jest-puppeteer",
  setupFilesAfterEnv: ["./jest.setup.js"],
  testMatch: ["**/*.steps.js"],
  testRunner: "jest-circus/runner",
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest"
  },
  verbose: true
}
