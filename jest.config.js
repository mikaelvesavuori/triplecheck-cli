module.exports = {
  collectCoverage: true,
  coverageDirectory: 'jest-coverage',
  collectCoverageFrom: ['src/*.ts', 'src/**/*.ts'],
  coveragePathIgnorePatterns: ['/__testdata__/', '/build/'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  moduleFileExtensions: ['js', 'ts'],
  modulePathIgnorePatterns: ['<rootDir>/build'],
  testMatch: ['<rootDir>/__tests__/**/*.test.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/build/'],
  testTimeout: 30000
};
