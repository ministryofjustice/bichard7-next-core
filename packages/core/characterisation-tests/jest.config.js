module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest"
  }
}
