export declare type Config = {
    identity: Identity;
    tests: Tests;
    resources: Resources;
    publishing: Publishing;
};
declare type Identity = {
    version: string;
    type: string;
    name: string;
    endpoint?: string;
};
export declare type Tests = {
    include?: string[];
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
