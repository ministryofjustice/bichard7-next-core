module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  modulePathIgnorePatterns: ["node_modules", "build"],
  moduleNameMapper: {
    "^src/(.*)": "<rootDir>/src/$1",
    "^tests/(.*)": "<rootDir>/tests/$1",
    "^data/(.*)": "<rootDir>/data/$1"
  }
}
