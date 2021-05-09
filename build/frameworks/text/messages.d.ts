export declare const msgJobCompleteInit = "\u2705 Created a configuration file you --> triplecheck.config.json";
export declare const msgJobCompleteInitStopped = "\u26A0\uFE0F Skipping generation of configuration file since one was already present...";
export declare const msgTestPassed: (serviceName: string, version: string, consumerName: string) => string;
export declare const msgTestFailed: (serviceName: string, version: string, consumerName: string, error: string) => string;
export declare const msgContractFileNotFound: (serviceName: string, version: string) => string;
export declare const msgTestingService: (serviceName: string, version: string) => string;
export declare const msgSuccessfullyPublished = "Successfully published contracts and tests";
export declare const errorMissingTestsContracts = "\u274C Missing consumer tests and/or provider contracts!";
export declare const errorMissingTestsForService = "\u274C No consumer tests found for this service!";
export declare const errorMissingPublishEndpoint = "\u274C Missing endpoint when trying to publish!";
export declare const warnMissingConsumerTestData = "\u26A0\uFE0F Missing consumer test data! Skipping tests...";
export declare const warnMissingPathToLocalContracts = "\u26A0\uFE0F Missing path to local contracts, skipping publishing these...";
export declare const warnMissingPathToLocalTests = "\u26A0\uFE0F Missing path to local tests, skipping publishing these...";
export declare const warnMissingContractWhenGeneratingFile: (serviceName: string, version: string) => string;
export declare const warnNothingToPublish = "\u26A0\uFE0F Attempting to publish, but there is nothing to publish: The configuration has disabled both publishing local tests and contracts.\nExiting...";
export declare const warnPublishingWithNoLocals = "\u26A0\uFE0F Attempting to publish, but you are missing \"resources.local\" (and the required \"resources.local.contractsPath\" and \"resources.local.testsPath\") in your configuration. You can only publish local contracts/tests.";
export declare const warnPublishingWithNoEndpoint = "\u26A0\uFE0F Attempting to publish, but you are missing \"resources.remote\" (and the required \"resources.remote.brokerEndpoint\") in your configuration.";
