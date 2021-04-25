/**
 * @description Example of a service ("demo-service") and its relations. It is dependent on another service called "identity-service".
 * The broker acts as a global storage of contracts and tests.
 *
 * We don't care who wrote a test for a service, just that all tests work for our service and any of our dependents. This is because
 * the tests and contract(s) themselves and their functioning (should) have no specific, logical relation to who wrote them;
 * After all, a request/payload simply has no identity concept and the response is neutral to who sent it.
 */

/**
 * SERVICE, LOCAL DATA
 */

// Our contract
const contracts = [
  {
    'demo-service': {
      '1.0.0': {
        schema: {
          name: 'string'
        },
        endpoint: 'https://asdf.com/api'
      }
    }
  }
];

// A test for our contract
const tests = [
  {
    'demo-service': {
      '1.0.0': [
        {
          name: 'Someone'
        }
      ]
    }
  }
];

/**
 * CLI
 */

const config = {
  identity: {
    name: 'demo-service',
    version: '1.0.0',
    endpoint: 'http://localhost:8080/api'
  },
  dependencies: ['identity-service@2.1.5'], // These are the service we depend on
  tests: {
    include: [],
    exclude: []
  },
  resources: {
    contractsLocal: contracts,
    contractsCollection: 'https://triplecheck-data-service.mikaelvesavuori.workers.dev/contracts',
    testsLocal: tests,
    testsCollection: 'https://triplecheck-data-service.mikaelvesavuori.workers.dev/tests'
  }
};

/**
 * BROKER
 */

class Database {
  /**
   * Contracts should be "owned" by the respective services. The individual service is primarily responsible for creating, updating and publishing their contract.
   */
  private contracts: any = {
    'demo-service': {
      '1.0.0': {
        schema: {
          name: 'string'
        },
        endpoint: 'https://asdf.com/api'
      }
    },
    'identity-service': {
      '2.1.5': {
        schema: {
          name: 'string'
        },
        endpoint: 'https://asdf.com/api'
      }
    },
    'new-payment-service': {
      '0.0.1': {
        schema: {
          name: 'string'
        },
        endpoint: 'https://asdf.com/api'
      }
    }
  };

  /**
   * Tests can be written by anyone who has a dependency toward a given service.
   */
  private tests: any = {
    'demo-service': {
      '1.0.0': [
        {
          'Demo test': {
            name: 'Someone'
          }
        }
      ]
    },
    'identity-service': {
      '2.1.5': [
        {
          'Demo test': {
            name: 'Someone'
          }
        }
      ]
    },
    'new-payment-service': {
      '0.0.1': [
        {
          'Demo test': {
            name: 'Someone'
          }
        }
      ]
    }
  };

  // Consumer-end relations; see what consuming a service (and version) USES ("dependsOn") --> key USES value(s)
  // Calculated based on what tests are run (?)
  public _consumerRelations: any = {
    'demo-service': {
      '1.0.0': ['identity-service@2.1.5']
    },
    'new-payment-service': {
      '0.0.1': ['demo-service@1.0.0']
    }
  };

  public consumerRelations: any = {};

  // Provider-end relations; see what provider services (and versions) are USED BY others ("usedBy") --> key is USED BY value(s)
  public providerRelations: any = {
    'identity-service': {
      '2.1.5': ['demo-service@1.0.0']
    },
    'demo-service': {
      '1.0.0': ['new-payment-service@0.0.1']
    }
  };

  public _providerRelations: any = {};

  //serviceIdentity: string
  public getData = (service: any) => {
    //console.log(service.dependencies);
    const thisServiceName = `${service.identity.name}@${service.identity.version}`;

    const dependents = this.getDependents(thisServiceName);
    console.log('dependents', dependents);

    const services: string[] = [...dependents.dependsOn, thisServiceName];
    //['identity-service@2.1.5', 'new-payment-service@0.0.1'];

    const _contracts = services.map((service: string) => ({
      [service]: this.getContract(service)
    }));
    //console.log('CONTRACTS', _contracts);

    const _tests = services.map((service: string) => ({ [service]: this.getTests(service) }));
    //console.log('TESTS', _tests);

    const contract = _contracts; // this.getContract(thisServiceName);
    const tests = _tests; // this.getTests(thisServiceName);

    return {
      providerContracts: contract,
      consumerTests: tests
    };
  };

  private getContract = (serviceIdentity: string) => {
    const [serviceName, serviceVersion] = serviceIdentity.split('@');
    return this.contracts[serviceName][serviceVersion];
  };

  private getTests = (serviceIdentity: string) => {
    const [serviceName, serviceVersion] = serviceIdentity.split('@');
    return this.tests[serviceName][serviceVersion];
  };

  private getDependents = (serviceName: string) => {
    return this.getRelations(serviceName);
  };

  /**
   * @description Resolve relations: what a service uses, and who is using it.
   */
  public getRelations = (serviceIdentity: string) => {
    const [serviceName, serviceVersion] = serviceIdentity.split('@');
    const consumerRelations = (() => {
      if (
        this.consumerRelations[serviceName] &&
        this.consumerRelations[serviceName][serviceVersion]
      ) {
        return this.consumerRelations[serviceName][serviceVersion];
      } else return [];
    })();
    const providerRelations = (() => {
      if (
        this.providerRelations[serviceName] &&
        this.providerRelations[serviceName][serviceVersion]
      ) {
        return this.providerRelations[serviceName][serviceVersion];
      } else return [];
    })();
    /*
    const providerRelations = Object.keys(this.providerRelations).map((service: string) => {
      const versions = Object.keys(this.providerRelations[service]);
      return versions.map((version: string) => {
        const dependents = this.providerRelations[service][version];
        const HAS_SERVICE = dependents.includes(serviceIdentity);
        if (HAS_SERVICE) return `${service}@${version}`;
      });
    });
    */

    return {
      dependsOn: consumerRelations,
      usedBy: providerRelations
    };
  };

  public publish = (data: any) => {
    const { contracts, tests, dependencies, identity } = data;
    this.updateContracts(contracts);
    this.updateTests(tests);
    this.updateDependencies(identity, dependencies);

    //const dependents = this.getDependents();
    //this.updateDependents(dependents);
  };

  private updateContracts = (data: any) => {
    this.contracts = { ...this.contracts, ...data[0] };
  };

  private updateTests = (data: any) => {
    this.tests = { ...this.tests, ...data[0] };
  };

  private updateDependencies = (identity: any, dependencies: any) => {
    const relation = {
      [identity.name]: {
        [identity.version]: dependencies
      }
    };
    this.consumerRelations = { ...this.consumerRelations, ...relation };
    console.log(this.consumerRelations);
  };

  //private updateDependents = (data: any) => {
  //
  //};
}

const db = new Database();

// Get all contracts and tests that are pertinent for this version of our service
const { identity, dependencies } = config;
const service = { identity, dependencies };
const serviceName = `${identity.name}@${identity.version}`;

//const consumerRelations = db.getRelations(serviceName);
//console.log(consumerRelations);

const publishPayload = {
  tests: [
    // Can be uploaded by ourself or by any other dependent service
    /*
    {
      'demo-service': {
        '1.0.0': [
          {
            'Demo test': {
              name: 'Mikael'
            }
          }
        ]
      }
    },
    */
    {
      'identity-service': {
        '2.1.5': [
          {
            'Demo test': {
              name: 'Someone'
            }
          }
        ]
      }
    }
  ],
  contracts: [
    /*
    {
      'demo-service': {
        '1.0.0': {
          schema: {
            name: 'Mikael'
          },
          endpoint: 'https://asdf.com/api'
        }
      }
    },
    */
    {
      'new-payment-service': {
        '0.0.1': {
          schema: {
            name: 'string'
          },
          endpoint: 'https://asdf.com/api'
        }
      }
    }
  ],
  identity,
  dependencies
};

db.publish(publishPayload);

const data = db.getData(service);
console.log(data);

/*
Do we test what we depend on, what we are used by, both, or none...?

{
  dependsOn: [ 'identity-service@2.1.5' ] ----> Verify what our expectations are of others
  usedBy: [ 'new-payment-service@0.0.1' ] ----> Don't mess up what others expect of us
}
*/

// Request contract and tests
const newGetDataInput = ['demo-service@1.0.0']; // Multiple services: ['demo-service@1.0.0', 'demo-service@1.1.0', 'some-service@2.0.0']

const newGetDataResponse = {
  // Single service
  providerContracts: [
    {
      'demo-service': {
        '1.0.0': {
          key: 'value'
        }
      }
    },
    {
      'identity-service': {
        '2.1.5': {
          schema: {
            name: 'string'
          },
          endpoint: 'https://asdf.com/api'
        }
      }
    }
  ],
  consumerTests: [
    {
      'demo-service': {
        '1.0.0': [
          {
            key: 'value'
          }
        ]
      }
    },
    {
      'identity-service': {
        '2.1.5': [
          {
            'Demo test': {
              name: 'Someone'
            }
          }
        ]
      }
    }
  ]
  /*
  // Multiple services
  providerContracts: [
    { 'demo-service': { '1.0.0': { key: 'value' }, '1.1.0': { key: 'value' } } },
    { 'some-service': { '2.0.0': { key: 'value' } } }
  ],
  consumerTests: [
    { 'demo-service': { '1.0.0': [{ key: 'value' }], '1.1.0': [{ key: 'value' }] } },
    { 'some-service': { '2.0.0': [{ key: 'value' }] } }
  ]
  */
};
