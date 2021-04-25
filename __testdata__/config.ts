import { version } from '../package.json';

export const config = {
  identity: {
    version,
    type: 'provider', // What if something is a provider, but also a consumer?
    name: 'api-provider',
    endpoint: 'http://localhost:8080/api'
  },
  tests: {
    testScope: ['some-provider'], // By using a "whitelisting" policy we can have a complete list of what services we actually are interested in
    excludeScope: [],
    // testAll: true, ???
    verifyLiveEndpoints: false,
    skipTestingLocalResources: false,
    skipTestingRemoteResources: false
  },
  requestOptions: {},
  resources: {
    contractsLocal: '__testdata__/contracts.ts',
    contractsCollection: 'https://triplecheck-data-service.mikaelvesavuori.workers.dev/contracts',
    testsLocal: '__testdata__/tests.ts',
    testsCollection: 'https://triplecheck-data-service.mikaelvesavuori.workers.dev/tests'
  },
  publishing: {
    brokerEndpoint: 'https://triplecheck-data-service.mikaelvesavuori.workers.dev/publish',
    publishLocalContracts: true,
    publishLocalTests: true,
    overwritePolicy: {
      remoteCollectionIsMaster: true
    }
  }
};
