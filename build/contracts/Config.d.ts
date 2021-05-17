export declare type Config = {
    identity: Identity;
    dependencies: Dependency[];
    tests: Tests;
    resources: Resources;
    publishing: Publishing;
};
export declare type Identity = {
    name: string;
    version: string;
};
export declare type Dependency = string;
export declare type Tests = {
    include?: string[];
    skipTestingRemoteResources?: boolean;
    skipTestingLocalResources?: boolean;
    skipIncludingDependents?: boolean;
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
