import { Config } from '../contracts/Config';
export declare const createNewTripleCheck: (config: Config) => Promise<TripleCheck>;
export declare class TripleCheck {
    serviceName: string | undefined;
    serviceVersion: string | undefined;
    serviceType: string | undefined;
    serviceEndpoint: string | undefined;
    contractFilePath: string | undefined;
    tests: any;
    contracts: any;
    config: Config;
    constructor(config: Config);
    init(): Promise<void>;
    private updateTestScopes;
    private updateLoadedResources;
    private loadData;
    getCleanedData(onlyLocalData?: boolean): Promise<any>;
    test(): Promise<void>;
    private call;
    private callStub;
    private generateContractFile;
    publish(): Promise<void>;
}
