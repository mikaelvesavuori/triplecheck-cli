"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripleCheck = exports.createNewTripleCheck = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const clean_1 = require("../frameworks/data/clean");
const validateConfig_1 = require("../frameworks/config/validateConfig");
const getContract_1 = require("../frameworks/convert/getContract");
const mergeDatasets_1 = require("../frameworks/data/mergeDatasets");
const loadDataLocal_1 = require("../frameworks/load/loadDataLocal");
const loadDataRemote_1 = require("../frameworks/load/loadDataRemote");
const createContractFile_1 = require("../frameworks/convert/createContractFile");
const consoleOutput_1 = require("../frameworks/text/consoleOutput");
const messages_1 = require("../frameworks/text/messages");
const createNewTripleCheck = (config) => __awaiter(void 0, void 0, void 0, function* () {
    const tripleCheck = new TripleCheck(config);
    yield tripleCheck.init();
    return tripleCheck;
});
exports.createNewTripleCheck = createNewTripleCheck;
class TripleCheck {
    constructor(config) {
        var _a, _b;
        this.serviceName = config.identity.name;
        this.serviceVersion = config.identity.version;
        this.serviceType = config.identity.type;
        this.serviceEndpoint = config.identity.endpoint || '';
        this.contractFilePath =
            ((_b = (_a = config.tests) === null || _a === void 0 ? void 0 : _a.contractFilePath) === null || _b === void 0 ? void 0 : _b.replace(/.ts/gi, '')) || '__quicktype-contract';
        this.config = config;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { resources, tests, identity } = this.config;
                let { include } = tests;
                if (!include)
                    include = [];
                if (include.length === 0)
                    include.push(`${identity.name}@${identity.version}`);
                this.updateTestScopes(include);
                const loadedData = yield this.loadData(resources, tests);
                if (!(loadedData === null || loadedData === void 0 ? void 0 : loadedData.consumerTests) || !(loadedData === null || loadedData === void 0 ? void 0 : loadedData.providerContracts))
                    throw new Error(messages_1.errorMissingTestsContracts);
                this.updateLoadedResources(loadedData.consumerTests, loadedData.providerContracts);
                validateConfig_1.validateConfig(this.config);
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    updateTestScopes(include) {
        this.config.tests.include = include;
    }
    updateLoadedResources(consumerTests, providerContracts) {
        this.tests = consumerTests;
        this.contracts = providerContracts;
    }
    loadData(resources, tests) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { testsLocal, testsCollection, contractsLocal, contractsCollection } = resources;
                const { include } = tests;
                let consumerTests = {};
                let providerContracts = {};
                if (testsLocal) {
                    const data = loadDataLocal_1.loadDataLocal(testsLocal);
                    consumerTests.local = clean_1.clean(data, include);
                }
                if (testsCollection) {
                    const type = 'tests';
                    const fetchedTests = yield loadDataRemote_1.loadDataRemote(type, testsCollection, include);
                    if (fetchedTests)
                        consumerTests.remote = fetchedTests;
                }
                if (contractsLocal) {
                    const data = loadDataLocal_1.loadDataLocal(contractsLocal);
                    providerContracts.local = clean_1.clean(data, include);
                }
                if (contractsCollection) {
                    const type = 'contracts';
                    const fetchedContracts = yield loadDataRemote_1.loadDataRemote(type, contractsCollection, include);
                    if (fetchedContracts)
                        providerContracts.remote = fetchedContracts;
                }
                return {
                    consumerTests,
                    providerContracts
                };
            }
            catch (error) {
                console.error(`Error when loading data:\n${error.message}`);
                return null;
            }
        });
    }
    getCleanedData(onlyLocalData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tests } = this.config;
            const { include, skipTestingRemoteResources, skipTestingLocalResources } = tests;
            const providerContracts = this.contracts;
            const consumerTests = this.tests;
            if (!consumerTests || consumerTests.length === 0) {
                console.warn(messages_1.warnMissingConsumerTestData);
                return;
            }
            const trimmedData = {
                providerContracts,
                consumerTests
            };
            if (onlyLocalData) {
                return {
                    tests: trimmedData.consumerTests.local,
                    contracts: trimmedData.providerContracts.local
                };
            }
            const mergedTests = (() => {
                if (skipTestingLocalResources)
                    return mergeDatasets_1.mergeDatasets([], trimmedData.consumerTests.remote);
                else if (skipTestingRemoteResources)
                    return mergeDatasets_1.mergeDatasets(trimmedData.consumerTests.local, []);
                else
                    return mergeDatasets_1.mergeDatasets(trimmedData.consumerTests.local, trimmedData.consumerTests.remote);
            })();
            const mergedContracts = (() => {
                if (skipTestingLocalResources)
                    return mergeDatasets_1.mergeDatasets([], trimmedData.providerContracts.remote);
                else if (skipTestingRemoteResources)
                    return mergeDatasets_1.mergeDatasets(trimmedData.providerContracts.local, []);
                else
                    return mergeDatasets_1.mergeDatasets(trimmedData.providerContracts.local, trimmedData.providerContracts.remote);
            })();
            return {
                tests: mergedTests,
                contracts: mergedContracts
            };
        });
    }
    test() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { contracts, tests } = yield this.getCleanedData();
                let failedTestCount = 0;
                if (contracts.length === 0 && tests.length === 0) {
                    consoleOutput_1.consoleOutput('ContractsAndTestsMissing');
                    return;
                }
                consoleOutput_1.consoleOutput('StartTests');
                const _consumerTests = tests.map((test) => __awaiter(this, void 0, void 0, function* () {
                    const serviceName = Object.keys(test)[0];
                    const versions = Object.keys(test[serviceName]);
                    const _versions = versions.map((version) => __awaiter(this, void 0, void 0, function* () {
                        const serviceTests = test[serviceName][version];
                        if (!serviceTests)
                            throw new Error(messages_1.errorMissingTestsForService);
                        console.log(messages_1.msgTestingService(serviceName, version));
                        const generated = yield this.generateContractFile(serviceName, version, contracts);
                        if (!generated)
                            return;
                        const _serviceTests = serviceTests.map((serviceTest) => __awaiter(this, void 0, void 0, function* () {
                            const service = Object.entries(serviceTest)[0];
                            const consumerName = service[0];
                            const payload = service[1];
                            const passed = yield this.call({
                                serviceName,
                                version,
                                consumerName,
                                payload
                            });
                            if (!passed)
                                failedTestCount += 1;
                        }));
                        yield Promise.all(_serviceTests);
                    }));
                    yield Promise.all(_versions);
                }));
                yield Promise.all(_consumerTests);
                if (failedTestCount > 0) {
                    consoleOutput_1.consoleOutput('TestsFailed', failedTestCount);
                    process.exit(1);
                }
                consoleOutput_1.consoleOutput('TestsFinished');
                process.exit(0);
            }
            catch (error) {
                console.error(`Error when testing:\n ${error.message}`);
            }
        });
    }
    call(callInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const { serviceName, version, consumerName } = callInput;
            try {
                yield this.callStub(callInput);
                console.log(messages_1.msgTestPassed(serviceName, version, consumerName));
                return true;
            }
            catch (error) {
                console.error(messages_1.msgTestFailed(serviceName, version, consumerName, error.message));
                return false;
            }
        });
    }
    callStub(callInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const { serviceName, version, payload } = callInput;
            const FULL_CONTRACT_FILEPATH = `${this.contractFilePath}-${serviceName}-${version}.js`;
            const contract = yield Promise.resolve().then(() => __importStar(require(`${process.cwd()}/${FULL_CONTRACT_FILEPATH}`)));
            contract.toContract(JSON.stringify(payload));
        });
    }
    generateContractFile(serviceName, version, contracts) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!contracts || contracts.length === 0) {
                console.warn(messages_1.warnMissingContractWhenGeneratingFile);
                return false;
            }
            const contract = getContract_1.getContract(contracts, serviceName, version);
            if (!contract) {
                console.warn(messages_1.msgContractFileNotFound(serviceName, version));
                return false;
            }
            const FULL_CONTRACT_FILEPATH = `${this.contractFilePath}-${serviceName}-${version}.js`;
            yield createContractFile_1.createContractFile(contract, FULL_CONTRACT_FILEPATH);
            return true;
        });
    }
    publish() {
        return __awaiter(this, void 0, void 0, function* () {
            const name = this.serviceName;
            const version = this.serviceVersion;
            const type = this.serviceType;
            const { resources, publishing } = this.config;
            const { contractsLocal, testsLocal } = resources;
            if (!contractsLocal)
                console.warn(messages_1.warnMissingPathToLocalContracts);
            if (!testsLocal)
                console.warn(messages_1.warnMissingPathToLocalTests);
            const { brokerEndpoint, publishLocalContracts, publishLocalTests } = publishing;
            if (!brokerEndpoint)
                throw new Error(messages_1.errorMissingPublishEndpoint);
            if (!publishLocalContracts && !publishLocalTests) {
                console.warn(messages_1.warnNothingToPublish);
                return;
            }
            let { contracts, tests } = yield this.getCleanedData(true);
            if (!publishLocalContracts)
                contracts = [];
            if (!publishLocalTests)
                tests = [];
            const data = {
                version,
                type,
                name,
                contracts,
                tests
            };
            if (process.env.NODE_ENV === 'test')
                return;
            yield node_fetch_1.default(brokerEndpoint, {
                method: 'POST',
                body: JSON.stringify(data)
            })
                .then(() => {
                console.log(messages_1.msgSuccessfullyPublished);
            })
                .catch((error) => {
                console.error(`Error when publishing:\n${error.message}`);
            });
            process.exit(0);
        });
    }
}
exports.TripleCheck = TripleCheck;
//# sourceMappingURL=TripleCheck.js.map