module.exports = {
  setupFilesAfterEnv: ['jest-extended'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './lib',
  verbose: true,
  testRegex: '.spec.ts$',
  transform: { '^.+\\.(t|j)s$': 'ts-jest' },
  testEnvironment: 'node',
};
