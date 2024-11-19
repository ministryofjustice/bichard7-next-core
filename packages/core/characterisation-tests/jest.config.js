/* eslint-disable no-undef */
module.exports = {
  preset: "ts-jest",
  // Run these files after jest has been
  // installed in the environment
  setupFilesAfterEnv: ["./jest.setup.ts"],
  testEnvironment: "node",
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest"
  },
  verbose: true
}
