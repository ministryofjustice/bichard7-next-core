module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  modulePathIgnorePatterns: ["node_modules", "build"],
  moduleNameMapper: {
    "src/(.*)": "<rootDir>/src/$1"
  }
}
