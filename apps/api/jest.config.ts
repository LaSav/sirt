import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  moduleFileExtensions: ['ts', 'js'],
  globals: {
    'ts-jest': { tsconfig: '<rootDir>/tsconfig.test.json', useESM: true },
  },
}

export default config
