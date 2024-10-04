/* eslint-disable no-undef */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  // Run these files after jest has been
  // installed in the environment
  setupFilesAfterEnv: ["./jest.setup.ts"],
  verbose: true,
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest"
  }
}
