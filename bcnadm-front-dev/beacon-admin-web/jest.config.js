const config = {
  setupFiles: ['<rootDir>/src/test/shimSetup.js', '<rootDir>/src/test/setup.js', 'jest-localstorage-mock'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  collectCoverage: false,
  collectCoverageFrom: ['**/*.{js,jsx}', '!**/node_modules/**', '!**/vendor/**', '!**/coverage/**', '!**/out/**'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/src/test/__mocks__/fileMock.js',
    '\\.(css|less|scss)$': '<rootDir>/src/test/__mocks__/styleMock.js'
  },
  testPathIgnorePatterns: ['dist'],
  testEnvironment: 'jsdom'
};

module.exports = config;
