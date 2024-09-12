module.exports = {
  clearMocks: true,
  preset: "jest-puppeteer",
  testMatch: ["**/*.steps.js"],
  testRunner: "jest-circus/runner",
  setupFilesAfterEnv: ["./jest.setup.js"],
  maxConcurrency: 1,
  maxWorkers: 1,
  verbose: true,
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest"
  }
}
