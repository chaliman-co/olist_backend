import { defaults } from 'jest-config'
export default {
  testMatch: [...defaults.testMatch, '**/__tests__/**/*test.mjs'],
  testEnvironment: 'jest-environment-node',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.mjs$': 'babel-jest'
  }
}
