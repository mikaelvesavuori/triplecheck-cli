export declare type Config = {
    identity: Identity;
    tests: Tests;
    resources: Resources;
    publishing: Publishing;
};
declare type Identity = {
    name: string;
    version: string;
};
export declare type Tests = {
    include?: string[];
    skipTestingRemoteResources?: boolean;
    skipTestingLocalResources?: boolean;
    contractFilePrefix?: string;
};
export declare type Resources = {
    local?: {
        contractsPath?: string;
        testsPath?: string;
    };
    remote?: {
        brokerEndpoint?: string;
    };
};
declare type Publishing = {
    publishLocalContracts: boolean;
    publishLocalTests: boolean;
};
export {};
