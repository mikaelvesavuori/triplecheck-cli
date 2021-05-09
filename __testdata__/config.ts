import { version } from '../package.json';

export const config = {
  identity: {
    version,
    type: 'provider', // What if something is a provider, but also a consumer?
    name: 'api-provider',
    endpoint: 'http://localhost:8080/api'
  },
  tests: {
    include: ['some-provider'], // By using a "whitelisting" policy we can have a complete list of what services we actually are interested in
    verifyLiveEndpoints: false,
    skipTestingLocalResources: false,
    skipTestingRemoteResources: false
  },
  requestOptions: {},
  resources: {
    local: {
      contractsPath: '__testdata__/contracts.ts',
      testsPath: '__testdata__/tests.ts'
    },
    remote: {
      brokerEndpoint: 'https://triplecheck-data-service.mikaelvesavuori.workers.dev/publish'
    }
  },
  publishing: {
    publishLocalContracts: true,
    publishLocalTests: true
  }
};
