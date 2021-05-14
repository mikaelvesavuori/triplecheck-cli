import { getContract } from '../../src/frameworks/convert/getContract';

const providerContractsLocal = [
  {
    'api-provider': {
      '1.0.0': {
        name: 'asdf'
      },
      endpoint: 'http://localhost:8080/api'
    }
  }
];

describe('Failure cases', () => {
  test('It should throw an error if no argument is provided', () => {
    expect(() => {
      // @ts-ignore
      getContract();
    }).toThrow();
  });
});

describe('Success cases', () => {
  test('It should get a contract when given a service/contract name and version', () => {
    expect(getContract(providerContractsLocal, 'api-provider', '1.0.0')).toMatchObject({
      name: 'asdf'
    });
  });
});
