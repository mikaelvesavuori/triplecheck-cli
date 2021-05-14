export const providerContractsLocal = [
  {
    name: 'asdf'
  }
];

export const testData = {
  contracts: [
    {
      'asdf-provider': {
        '1.0.0': {
          name: 'asdf'
        }
      }
    },
    {
      'api-provider': {
        '1.0.0': {
          definitions: {},
          $id: 'http://example.com/common.json',
          servers: [
            {
              url: 'https://abcde12345.execute-api.eu-north-1.amazonaws.com/{basePath}',
              variables: {
                basePath: {
                  default: '/dev'
                }
              }
            }
          ],
          type: 'object',
          title: 'The root schema',
          required: ['name', 'email', 'totalPrice'],
          properties: {
            name: {
              type: 'string',
              title: 'The name schema',
              description: 'Customer name',
              default: 'Firstname Lastname'
            },
            email: {
              type: 'string',
              title: 'The email schema',
              description: 'Customer email',
              default: 'firstname.lastname@somewhere.xyz'
            },
            totalPrice: {
              type: 'number',
              title: 'The totalPrice schema',
              description: 'Total price of wares in USD cents',
              default: 0
            },
            isTest: {
              type: 'boolean',
              title: 'The testId schema',
              description: 'Is this a test?',
              default: false
            }
          }
        }
      }
    }
  ],
  tests: [
    { 'asdf-provider': { '1.0.0': [{ demo: { asdf: 'asdf' } }] } },
    { 'some-provider': { '0.0.1': [{ 'Should Do Something': { asdf: 123 } }] } },
    {
      'api-provider': [
        {
          '1.0.0': [
            { 'Should Take Customer': { name: 'name', email: 'email', totalPrice: 12345 } },
            { 'Something Here': { name: 'Someone', email: 'email', totalPrice: 12345 } },
            {
              'Should Take Customer': { name: 'name', email: 'email', totalPrice: 1234512345 }
            },
            {
              'Something Really Specific': {
                name: 'Someone',
                email: 'someone@somewhere.net',
                totalPrice: 100
              }
            }
          ]
        },
        {
          '1.0.1': [
            {
              'Something Else Here': {
                name: 'name',
                email: 'email',
                totalPrice: 12345,
                newField: true
              }
            }
          ]
        },
        { '1.1.4': [{ asdf: { name: 'kalle' } }] }
      ]
    }
  ]
};
