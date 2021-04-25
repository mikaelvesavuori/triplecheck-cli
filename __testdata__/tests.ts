export = [
  {
    // Test against our own service
    'api-provider': {
      '1.0.0': [
        {
          'Should Take Customer legacy': {
            name: 'Mikael',
            email: 'email',
            totalPrice: 12345
          }
        }
      ],
      '1.0.1': [
        {
          'Should Take Customer new': {
            name: 'Mikael',
            email: 'email',
            totalPrice: 12345
          }
        },
        {
          'Should Take Customer variant': {
            name: '1234',
            email: 'email',
            totalPrice: 0
          }
        }
      ]
    }
  },
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
];
