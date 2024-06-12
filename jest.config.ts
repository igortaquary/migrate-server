import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  collectCoverageFrom: ['<rootDir>/src/**/*.(t|j)s'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  preset: 'ts-jest',
  coveragePathIgnorePatterns: [
    'main.ts',
    '.module.ts',
    '.spec.ts',
    '.dto.ts',
    '.doc.ts',
    '.config.ts',
    '.entity.ts',
  ],
};

export default config;
