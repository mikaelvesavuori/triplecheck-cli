export type Config = {
    identity: Identity;
    dependencies: Dependency[];
    tests: Tests;
    resources: Resources;
    publishing: Publishing;
};
export type Identity = {
    name: string;
    version: string;
};
export type Dependency = string;
export type Tests = {
    include?: string[];
    skipTestingRemoteResources?: boolean;
    skipTestingLocalResources?: boolean;
    skipIncludingDependents?: boolean;
    contractFilePrefix?: string;
};
export type Resources = {
    local?: {
        contractsPath?: string;
        testsPath?: string;
    };
    remote?: {
        brokerEndpoint?: string;
    };
};
type Publishing = {
    publishLocalContracts: boolean;
    publishLocalTests: boolean;
};
export {};
