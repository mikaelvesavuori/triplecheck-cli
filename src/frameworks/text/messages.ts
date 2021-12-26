export const msgJobCompleteInit = `✅ Created a configuration file you --> triplecheck.config.json`;
export const msgJobCompleteInitStopped = `⚠️ Skipping generation of configuration file since one was already present...`;
export const msgTestPassed = (serviceName: string, version: string, consumerName: string) =>
  `✅ Successfully tested ${serviceName}@${version} with ${consumerName}`;
export const msgTestFailed = (
  serviceName: string,
  version: string,
  consumerName: string,
  error: string
) => `❌ Did not pass test for ${serviceName}@${version} with ${consumerName}\nError: ${error}`;
export const msgContractFileNotFound = (serviceName: string, version: string) =>
  `⚠️ Could not find any contracts for ${serviceName}@${version}!`;
export const msgTestingService = (serviceName: string, version: string) =>
  `Testing ${serviceName}@${version}...`;
export const msgSuccessfullyPublished = `Successfully published contracts and tests`;
export const msgErrorWhenPublishing = `Error when publishing`;
export const msgLoadingLocal = (path: string) => `Loading file from ${path}...`;
export const msgLoadingRemote = (url: string) => `Loading data from ${url}...`;

export const infoSkippingTestBecauseDuplicate = (testName: string) =>
  `ℹ️  Test named "${testName}" will be skipped from the test merge process, as an identically-named test has already been added...`;

export const warnMissingConsumerTestData = `⚠️ Missing consumer test data! Skipping tests...`;
export const warnMissingPathToLocalContracts = `⚠️ Missing path to local contracts, skipping publishing these...`;
export const warnMissingPathToLocalTests = `⚠️ Missing path to local tests, skipping publishing these...`;
export const warnMissingContractWhenGeneratingFile = (serviceName: string, version: string) =>
  `⚠️ No contracts present when running generateContractFile() for ${serviceName}@${version}!`;
export const warnPublishingWithNoLocals = `⚠️ Attempting to publish, but you are missing "resources.local" (and the required "resources.local.contractsPath" and "resources.local.testsPath") in your configuration. You can only publish local contracts/tests.`;
export const warnPublishingWithNoEndpoint = `⚠️ Attempting to publish, but you are missing "resources.remote" (and the required "resources.remote.brokerEndpoint") in your configuration.`;

export const errorMissingTestsContracts = `❌ Missing consumer tests and/or provider contracts!`;
export const errorMissingTestsForService = `❌ No consumer tests found for this service!`;
export const errorMissingPublishEndpoint = `❌ Missing endpoint when trying to publish!`;
export const errorInvalidIdentity = `❌ Invalid identity structure. Verify that your configuration's "identity" block uses only lowercase characters and hyphens for the name and a valid Semantic Version (for example, "1.5.0") for the version.`;
export const errorLoadingData = (message: string) => `Error when loading data: ${message}`;
export const errorWhenTesting = (message: string) => `Error when testing: ${message}`;
export const errorWhenPublishing = (message: string) => `Error when publishing: ${message}`;
