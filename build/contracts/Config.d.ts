export declare type Config = {
    identity: Identity;
    tests: Tests;
    resources: Resources;
    requestOptions: any;
    publishing: Publishing;
};
declare type Identity = {
    version: string;
    type: string;
    name: string;
    endpoint?: string;
};
export declare type Tests = {
    testScope?: string[];
    excludeScope?: string[];
    verifyLiveEndpoints?: boolean;
    skipTestingRemoteResources?: boolean;
    skipTestingLocalResources?: boolean;
    contractFilePath?: string;
};
export declare type Resources = {
    contractsLocal?: string;
    contractsCollection?: string;
    testsLocal?: string;
    testsCollection?: string;
};
declare type Publishing = {
    brokerEndpoint: string;
    publishLocalContracts: boolean;
    publishLocalTests: boolean;
};
export {};
