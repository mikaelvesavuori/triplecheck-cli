export const config = {
  identity: {
    name: 'api-provider',
    version: '1.0.0'
  },
  dependencies: ['gql-service@1.0.0'],
  tests: {
    include: [],
    skipTestingLocalResources: false,
    skipTestingRemoteResources: false
  },
  resources: {
    local: {
      contractsPath: '__testdata__/contracts.json',
      testsPath: '__testdata__/tests.json'
    },
    remote: {
      brokerEndpoint: 'https://triplecheck-data-service.mikaelvesavuori.workers.dev'
    }
  },
  publishing: {
    publishLocalContracts: true,
    publishLocalTests: true
  }
};
