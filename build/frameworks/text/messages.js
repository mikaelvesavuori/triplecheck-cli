"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorWhenPublishing = exports.errorWhenTesting = exports.errorLoadingData = exports.errorInvalidIdentity = exports.errorMissingPublishEndpoint = exports.errorMissingTestsForService = exports.errorMissingTestsContracts = exports.warnPublishingWithNoEndpoint = exports.warnPublishingWithNoLocals = exports.warnMissingContractWhenGeneratingFile = exports.warnMissingPathToLocalTests = exports.warnMissingPathToLocalContracts = exports.warnMissingConsumerTestData = exports.infoSkippingTestBecauseDuplicate = exports.msgLoadingRemote = exports.msgLoadingLocal = exports.msgErrorWhenPublishing = exports.msgSuccessfullyPublished = exports.msgTestingService = exports.msgContractFileNotFound = exports.msgTestFailed = exports.msgTestPassed = exports.msgJobCompleteInitStopped = exports.msgJobCompleteInit = void 0;
exports.msgJobCompleteInit = `✅ Created a configuration file you --> triplecheck.config.json`;
exports.msgJobCompleteInitStopped = `⚠️ Skipping generation of configuration file since one was already present...`;
const msgTestPassed = (serviceName, version, consumerName) => `✅ Successfully tested ${serviceName}@${version} with ${consumerName}`;
exports.msgTestPassed = msgTestPassed;
const msgTestFailed = (serviceName, version, consumerName, error) => `❌ Did not pass test for ${serviceName}@${version} with ${consumerName}\nError: ${error}`;
exports.msgTestFailed = msgTestFailed;
const msgContractFileNotFound = (serviceName, version) => `⚠️ Could not find any contracts for ${serviceName}@${version}!`;
exports.msgContractFileNotFound = msgContractFileNotFound;
const msgTestingService = (serviceName, version) => `Testing ${serviceName}@${version}...`;
exports.msgTestingService = msgTestingService;
exports.msgSuccessfullyPublished = `Successfully published contracts and tests`;
exports.msgErrorWhenPublishing = `Error when publishing`;
const msgLoadingLocal = (path) => `Loading file from ${path}...`;
exports.msgLoadingLocal = msgLoadingLocal;
const msgLoadingRemote = (url) => `Loading data from ${url}...`;
exports.msgLoadingRemote = msgLoadingRemote;
const infoSkippingTestBecauseDuplicate = (testName) => `ℹ️  Test named "${testName}" will be skipped from the test merge process, as an identically-named test has already been added...`;
exports.infoSkippingTestBecauseDuplicate = infoSkippingTestBecauseDuplicate;
exports.warnMissingConsumerTestData = `⚠️ Missing consumer test data! Skipping tests...`;
exports.warnMissingPathToLocalContracts = `⚠️ Missing path to local contracts, skipping publishing these...`;
exports.warnMissingPathToLocalTests = `⚠️ Missing path to local tests, skipping publishing these...`;
const warnMissingContractWhenGeneratingFile = (serviceName, version) => `⚠️ No contracts present when running generateContractFile() for ${serviceName}@${version}!`;
exports.warnMissingContractWhenGeneratingFile = warnMissingContractWhenGeneratingFile;
exports.warnPublishingWithNoLocals = `⚠️ Attempting to publish, but you are missing "resources.local" (and the required "resources.local.contractsPath" and "resources.local.testsPath") in your configuration. You can only publish local contracts/tests.`;
exports.warnPublishingWithNoEndpoint = `⚠️ Attempting to publish, but you are missing "resources.remote" (and the required "resources.remote.brokerEndpoint") in your configuration.`;
exports.errorMissingTestsContracts = `❌ Missing consumer tests and/or provider contracts!`;
exports.errorMissingTestsForService = `❌ No consumer tests found for this service!`;
exports.errorMissingPublishEndpoint = `❌ Missing endpoint when trying to publish!`;
exports.errorInvalidIdentity = `❌ Invalid identity structure. Verify that your configuration's "identity" block uses only lowercase characters and hyphens for the name and a valid Semantic Version (for example, "1.5.0") for the version.`;
const errorLoadingData = (message) => `Error when loading data: ${message}`;
exports.errorLoadingData = errorLoadingData;
const errorWhenTesting = (message) => `Error when testing: ${message}`;
exports.errorWhenTesting = errorWhenTesting;
const errorWhenPublishing = (message) => `Error when publishing: ${message}`;
exports.errorWhenPublishing = errorWhenPublishing;
//# sourceMappingURL=messages.js.map