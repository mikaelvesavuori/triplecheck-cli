import { trimData } from '../../../src/frameworks/data/trimData';

import tests from '../../../__testdata__/tests';
import contracts from '../../../__testdata__/contracts';

const testdata = {
  consumerTests: {
    local: tests,
    remote: tests
  },
  providerContracts: {
    local: contracts,
    remote: contracts
  }
};

describe('Success cases', () => {
  test('It should trim local and remote data for non-overlap', () => {
    const trimmed = trimData(JSON.parse(JSON.stringify(testdata)), [], []);

    expect(trimmed).toMatchObject({
      consumerTests: {
        local: [
          {
            'api-provider': {
              '1.0.0': [
                {
                  'Should Take Customer legacy': {
                    email: 'email',
                    name: 'Mikael',
                    totalPrice: 12345
                  }
                }
              ],
              '1.0.1': [
                {
                  'Should Take Customer new': { email: 'email', name: 'Mikael', totalPrice: 12345 }
                },
                {
                  'Should Take Customer variant': {
                    email: 'email',
                    name: '1234',
                    totalPrice: 0
                  }
                }
              ]
            }
          },
          { 'some-provider': { '1.0.0': [{ 'demo for some provider': { name: 123 } }] } }
        ]
      },
      providerContracts: {
        local: [
          {
            'api-provider': {
              '0.0.1': {
                $id: 'http://example.com/common.json',
                definitions: {},
                properties: {
                  email: {
                    default: 'firstname.lastname@somewhere.xyz',
                    description: 'Customer email',
                    title: 'The email schema',
                    type: 'string'
                  },
                  isTest: {
                    default: false,
                    description: 'Is this a test?',
                    title: 'The testId schema',
                    type: 'boolean'
                  },
                  name: {
                    default: 'Firstname Lastname',
                    description: 'Customer name',
                    title: 'The name schema',
                    type: 'string'
                  },
                  totalPrice: {
                    default: 0,
                    description: 'Total price of wares in USD cents',
                    title: 'The totalPrice schema',
                    type: 'number'
                  }
                },
                required: ['name', 'email', 'totalPrice'],
                servers: [
                  {
                    url: 'https://abcde12345.execute-api.eu-north-1.amazonaws.com/{basePath}',
                    variables: { basePath: { default: '/dev' } }
                  }
                ],
                title: 'The root schema',
                type: 'object'
              },
              '1.0.1': {
                $id: 'http://example.com/common.json',
                definitions: {},
                properties: {
                  email: {
                    default: 'firstname.lastname@somewhere.xyz',
                    description: 'Customer email',
                    title: 'The email schema',
                    type: 'string'
                  },
                  isTest: {
                    default: false,
                    description: 'Is this a test?',
                    title: 'The testId schema',
                    type: 'boolean'
                  },
                  name: {
                    default: 'Firstname Lastname',
                    description: 'Customer name',
                    title: 'The name schema',
                    type: 'string'
                  },
                  totalPrice: {
                    default: 0,
                    description: 'Total price of wares in USD cents',
                    title: 'The totalPrice schema',
                    type: 'number'
                  }
                },
                required: ['name', 'email', 'totalPrice'],
                servers: [
                  {
                    url: 'https://abcde12345.execute-api.eu-north-1.amazonaws.com/{basePath}',
                    variables: { basePath: { default: '/dev' } }
                  }
                ],
                title: 'The root schema',
                type: 'object'
              },
              endpoint: 'http://localhost:8080/api'
            }
          },
          { 'some-provider': { '1.0.0': { name: 123 } } }
        ]
      }
    });
  });

  test('It should trim excluded items', () => {
    const trimmed = trimData(JSON.parse(JSON.stringify(testdata)), [], ['api-provider']);

    expect(trimmed).toMatchObject({
      consumerTests: {
        local: [{ 'some-provider': { '1.0.0': [{ 'demo for some provider': { name: 123 } }] } }]
      },
      providerContracts: {
        local: [{ 'some-provider': { '1.0.0': { name: 123 } } }]
      }
    });
  });

  describe('It should handle exclusions that are nested in tests or contracts', () => {
    test('No local consumer tests', () => {
      const noLocalTests: any = JSON.parse(JSON.stringify(testdata));
      delete noLocalTests.consumerTests.local;
      const trimmed = trimData(noLocalTests, [], ['api-provider']);

      expect(trimmed).toMatchObject({
        consumerTests: {
          remote: [{ 'some-provider': { '1.0.0': [{ 'demo for some provider': { name: 123 } }] } }]
        },
        providerContracts: {
          remote: [{ 'some-provider': { '1.0.0': { name: 123 } } }]
        }
      });
    });
  });

  test('No local contracts', () => {
    const noLocalContracts: any = JSON.parse(JSON.stringify(testdata));
    delete noLocalContracts.providerContracts.local;
    const trimmed = trimData(noLocalContracts, [], ['api-provider']);

    expect(trimmed).toMatchObject({
      consumerTests: {
        remote: [{ 'some-provider': { '1.0.0': [{ 'demo for some provider': { name: 123 } }] } }]
      },
      providerContracts: {
        remote: [{ 'some-provider': { '1.0.0': { name: 123 } } }]
      }
    });
  });

  test('No remote consumer tests', () => {
    const noRemoteTests: any = JSON.parse(JSON.stringify(testdata));
    console.log('No remote consumer tests', testdata);
    delete noRemoteTests.consumerTests.remote;
    const trimmed = trimData(noRemoteTests, [], ['api-provider']);

    expect(trimmed).toMatchObject({
      consumerTests: {
        local: [{ 'some-provider': { '1.0.0': [{ 'demo for some provider': { name: 123 } }] } }]
      },
      providerContracts: {
        local: [{ 'some-provider': { '1.0.0': { name: 123 } } }]
      }
    });
  });

  test('No remote contracts', () => {
    const noRemoteContracts: any = JSON.parse(JSON.stringify(testdata));
    console.log('No remote contracts', testdata);
    delete noRemoteContracts.providerContracts.remote;
    const trimmed = trimData(noRemoteContracts, [], ['api-provider']);

    expect(trimmed).toMatchObject({
      consumerTests: {
        local: [{ 'some-provider': { '1.0.0': [{ 'demo for some provider': { name: 123 } }] } }]
      },
      providerContracts: {
        local: [{ 'some-provider': { '1.0.0': { name: 123 } } }]
      }
    });
  });

  describe('It should handle test scopes', () => {
    test('It should allow only a single provided scope', () => {
      const singleTest: any = JSON.parse(JSON.stringify(testdata));
      const trimmed = trimData(singleTest, ['some-provider']);

      expect(trimmed).toMatchObject({
        consumerTests: {
          local: [
            {
              'some-provider': {
                '1.0.0': [
                  {
                    'demo for some provider': {
                      name: 123
                    }
                  }
                ]
              }
            }
          ]
        },
        providerContracts: {
          local: [
            {
              'some-provider': {
                '1.0.0': {
                  name: 123
                }
              }
            }
          ]
        }
      });
    });
  });
});
