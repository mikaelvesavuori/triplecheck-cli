import { Config } from '../contracts/Config';
export declare const createNewTripleCheck: (config: Config) => Promise<TripleCheck>;
export declare class TripleCheck {
    serviceName: string | undefined;
    serviceVersion: string | undefined;
    contractFilePrefix: string | undefined;
    tests: any;
    contracts: any;
    config: Config;
    constructor(config: Config);
    init(): Promise<void>;
    private updateTestScopes;
    private updateLoadedResources;
    private loadData;
    getDependents(brokerEndpoint: string, dependencies: string[]): Promise<any>;
    getCleanedData(onlyLocalData?: boolean): Promise<any>;
    test(): Promise<void>;
    private call;
    private callStub;
    private generateContractFile;
    publish(): Promise<void>;
}
