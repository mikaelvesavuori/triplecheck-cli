export const consumerTests = [
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
        },
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
