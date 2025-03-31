module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
      "^.+\\.tsx?$": "ts-jest"
    },
    // Optionally, you can specify which files to include/exclude:
    // testMatch: ["**/tests/**/*.test.ts"],
  };
  