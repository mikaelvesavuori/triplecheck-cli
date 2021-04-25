export declare const configToInit: {
    identity: {
        version: string;
        type: string;
        name: string;
        endpoint: string;
    };
    tests: {
        testScope: never[];
        excludeScope: never[];
        verifyLiveEndpoints: boolean;
        skipTestingLocalResources: boolean;
        skipTestingRemoteResources: boolean;
    };
    requestOptions: {};
    resources: {
        contractsLocal: string;
        contractsCollection: string;
        testsLocal: string;
        testsCollection: string;
    };
    publishing: {
        brokerEndpoint: string;
        publishLocalContracts: boolean;
        publishLocalTests: boolean;
        overwritePolicy: {
            remoteCollectionIsMaster: boolean;
        };
    };
};
