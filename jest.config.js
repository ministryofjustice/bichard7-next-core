module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  modulePathIgnorePatterns: ["node_modules", "build"],
  moduleNameMapper: {
    "^(data|src|tests)$": "<rootDir>/$1",
    "^(data|src|tests)/(.*)": "<rootDir>/$1/$2"
  }
}
