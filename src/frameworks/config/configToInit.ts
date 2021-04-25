export const configToInit = {
  identity: {
    version: '__VERSION__',
    type: '', // "provider" or "consumer"
    name: 'your-service-name',
    endpoint: 'http://localhost:8080/api'
  },
  tests: {
    testScope: [],
    excludeScope: [],
    verifyLiveEndpoints: false,
    skipTestingLocalResources: false,
    skipTestingRemoteResources: false
  },
  requestOptions: {},
  resources: {
    contractsLocal: '',
    contractsCollection: '',
    testsLocal: '',
    testsCollection: ''
  },
  publishing: {
    brokerEndpoint: '',
    publishLocalContracts: true,
    publishLocalTests: true,
    overwritePolicy: {
      remoteCollectionIsMaster: true
    }
  }
};
