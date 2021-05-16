import { mergeDatasets } from '../../src/frameworks/data/mergeDatasets';

const consumerTestsLocal = [
  {
    'delivery-service': {
      '1.0.0': [
        {
          ShouldTakeOrder: {
            time: 'time',
            pizza: 'pizza',
            totalPrice: 12345
          }
        }
      ],
      '1.1.0': [
        {
          ShouldTakeOrderWithHomeDelivery: {
            time: 'time',
            pizza: 'pizza',
            totalPrice: 12345,
            homeDelivery: true
          }
        }
      ]
    }
  },
  {
    'api-provider': {
      '1.0.0': [
        {
          ShouldTakeCustomer: {
            name: 'name',
            email: 'email',
            totalPrice: 12345
          }
        }
      ]
    }
  }
];

const consumerTestsRemote = [
  {
    'delivery-service': {
      '1.0.0': [
        {
          ShouldTakeOrder: {
            time: 'time',
            pizza: 'pizza',
            totalPrice: 12345
          }
        }
      ]
    }
  },
  {
    'api-provider': {
      '1.0.0': [
        {
          ShouldTakeCustomerWithTestField: {
            name: 'name',
            email: 'email',
            totalPrice: 12345,
            test: true
          }
        },
        {
          ShouldFail: {
            name: 'name',
            email: 'email'
          }
        }
      ]
    }
  }
];

const providerContractsLocal = [
  {
    'api-provider': {
      '1.0.0': {
        name: 'asdf'
      }
    }
  }
];
const providerContractsRemote = [
  {
    'api-provider': {
      '1.0.1': {
        name: 'asdf'
      }
    }
  }
];

describe('Success cases', () => {
  describe('Consumer tests', () => {
    test('It should merge consumer tests', () => {
      expect(mergeDatasets(consumerTestsLocal, consumerTestsRemote)).toMatchObject([
        {
          'delivery-service': {
            '1.0.0': [
              {
                ShouldTakeOrder: {
                  pizza: 'pizza',
                  time: 'time',
                  totalPrice: 12345
                }
              }
            ],
            '1.1.0': [
              {
                ShouldTakeOrderWithHomeDelivery: {
                  homeDelivery: true,
                  pizza: 'pizza',
                  time: 'time',
                  totalPrice: 12345
                }
              }
            ]
          }
        },
        {
          'api-provider': {
            '1.0.0': [
              {
                ShouldTakeCustomerWithTestField: {
                  email: 'email',
                  name: 'name',
                  test: true,
                  totalPrice: 12345
                }
              },
              {
                ShouldFail: {
                  email: 'email',
                  name: 'name'
                }
              },
              {
                ShouldTakeCustomer: {
                  email: 'email',
                  name: 'name',
                  totalPrice: 12345
                }
              }
            ]
          }
        }
      ]);
    });
  });

  describe('Provider contracts', () => {
    test('It should merge provider versions', () => {
      expect(mergeDatasets(providerContractsLocal, providerContractsRemote)).toMatchObject([
        {
          'api-provider': {
            '1.0.0': { name: 'asdf' },
            '1.0.1': { name: 'asdf' }
          }
        }
      ]);
    });
  });
});
