"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configToInit = void 0;
exports.configToInit = {
    identity: {
        version: '__VERSION__',
        type: '',
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
//# sourceMappingURL=configToInit.js.map