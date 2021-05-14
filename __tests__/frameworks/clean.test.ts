import { clean } from '../../src/frameworks/data/clean';

const gqlDemoContractData = [
  {
    'gql-service': {
      '1.0.0': [
        {
          'just a demo for GQL conversion': {
            Query: {
              asdf: 1
            }
          }
        }
      ]
    }
  }
];

const apiDemoContractData = [
  {
    'api-provider': {
      '1.0.1': {
        name: '123',
        email: 'apsodj',
        totalPrice: 123412,
        somethingElse: {
          asdf: 123,
          isOn: true
        }
      }
    }
  }
];

describe('Failure cases', () => {
  test('It should throw an error if no argument is provided', () => {
    expect(() => {
      // @ts-ignore
      clean();
    }).toThrow();
  });
});

describe('Success cases', () => {
  test('It should return no data if the include array does not point to existing provided data', () => {
    expect(clean(gqlDemoContractData, ['some-nonexisting-service@1.0.0'])).toMatchObject({});
  });

  test('Given a single service, it should include a given service of a particular version and return only that data', () => {
    expect(clean(gqlDemoContractData, ['gql-service@1.0.0'])).toMatchObject(gqlDemoContractData);
  });

  test('Given multiple services, it should include a given service of a particular version and return only that data', () => {
    expect(
      clean([...gqlDemoContractData, ...apiDemoContractData], ['gql-service@1.0.0'])
    ).toMatchObject(gqlDemoContractData);
  });
});
