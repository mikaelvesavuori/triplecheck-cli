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
        this.contractFilePrefix =
            ((_b = (_a = config.tests) === null || _a === void 0 ? void 0 : _a.contractFilePrefix) === null || _b === void 0 ? void 0 : _b.replace(/.ts/gi, '')) || '__quicktype-contract';
        this.config = config;
    }
    init() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { identity, tests, resources } = this.config;
                const { skipIncludingDependents } = tests;
                let { include } = tests;
                if (!include)
                    include = [];
                if (include.length === 0)
                    include.push(`${identity.name}@${identity.version}`);
                if (((_a = resources.remote) === null || _a === void 0 ? void 0 : _a.brokerEndpoint) && !skipIncludingDependents) {
                    const dependents = yield this.getDependents(resources.remote.brokerEndpoint, [
                        `${identity.name}@${identity.version}`
                    ]);
                    const dedupedFinalIncludes = Array.from(new Set([...include, ...dependents]));
                    this.updateTestScopes(dedupedFinalIncludes);
                }
                else
                    this.updateTestScopes(include);
                const loadedData = yield this.loadData(resources, tests);
                if (!(loadedData === null || loadedData === void 0 ? void 0 : loadedData.consumerTests) || !(loadedData === null || loadedData === void 0 ? void 0 : loadedData.providerContracts))
                    throw new Error(messages_1.errorMissingTestsContracts);
                this.updateLoadedResources(loadedData.consumerTests, loadedData.providerContracts);
                if (!(0, validateConfig_1.validateConfig)(this.config))
                    process.exit(1);
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
                let localTests, localContracts, brokerEndpoint = undefined;
                const { include, skipTestingLocalResources, skipTestingRemoteResources } = tests;
                const { local, remote } = resources;
                if (local) {
                    localTests = local.testsPath;
                    localContracts = local.contractsPath;
                }
                if (remote)
                    brokerEndpoint = remote.brokerEndpoint;
                let consumerTests = {};
                let providerContracts = {};
                if (!skipTestingLocalResources && localTests) {
                    const data = (0, loadDataLocal_1.loadDataLocal)(localTests);
                    consumerTests.local = (0, clean_1.clean)(data, include || []);
                }
                if (!skipTestingRemoteResources && brokerEndpoint) {
                    const fetchedTests = yield (0, loadDataRemote_1.loadDataRemote)('tests', brokerEndpoint, include);
                    if (fetchedTests && process.env.NODE_ENV !== 'test')
                        consumerTests.remote = fetchedTests;
                }
                if (!skipTestingLocalResources && localContracts) {
                    const data = (0, loadDataLocal_1.loadDataLocal)(localContracts);
                    providerContracts.local = (0, clean_1.clean)(data, include || []);
                }
                if (!skipTestingRemoteResources && brokerEndpoint) {
                    const fetchedContracts = yield (0, loadDataRemote_1.loadDataRemote)('contracts', brokerEndpoint, include);
                    if (fetchedContracts && process.env.NODE_ENV !== 'test')
                        providerContracts.remote = fetchedContracts;
                }
                return {
                    consumerTests,
                    providerContracts
                };
            }
            catch (error) {
                console.error((0, messages_1.errorLoadingData)(error.message));
                return null;
            }
        });
    }
    getDependents(brokerEndpoint, dependencies) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, loadDataRemote_1.loadDataRemote)('dependents', brokerEndpoint, dependencies);
        });
    }
    getCleanedData(onlyLocalData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tests } = this.config;
            const { skipTestingRemoteResources, skipTestingLocalResources } = tests;
            const providerContracts = this.contracts;
            const consumerTests = this.tests;
            if (!consumerTests || consumerTests.length === 0) {
                console.warn(messages_1.warnMissingConsumerTestData);
                return;
            }
            if (onlyLocalData) {
                return {
                    tests: consumerTests.local,
                    contracts: providerContracts.local
                };
            }
            const mergedTests = (() => {
                if (skipTestingLocalResources)
                    return (0, mergeDatasets_1.mergeDatasets)([], consumerTests.remote);
                else if (skipTestingRemoteResources)
                    return (0, mergeDatasets_1.mergeDatasets)(consumerTests.local, []);
                else
                    return (0, mergeDatasets_1.mergeDatasets)(consumerTests.local, consumerTests.remote);
            })();
            const mergedContracts = (() => {
                if (skipTestingLocalResources)
                    return (0, mergeDatasets_1.mergeDatasets)([], providerContracts.remote);
                else if (skipTestingRemoteResources)
                    return (0, mergeDatasets_1.mergeDatasets)(providerContracts.local, []);
                else
                    return (0, mergeDatasets_1.mergeDatasets)(providerContracts.local, providerContracts.remote);
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
                    (0, consoleOutput_1.consoleOutput)('ContractsAndTestsMissing');
                    return;
                }
                (0, consoleOutput_1.consoleOutput)('StartTests');
                const _consumerTests = tests.map((test) => __awaiter(this, void 0, void 0, function* () {
                    const serviceName = Object.keys(test)[0];
                    const versions = Object.keys(test[serviceName]);
                    const _versions = versions.map((version) => __awaiter(this, void 0, void 0, function* () {
                        const serviceTests = test[serviceName][version];
                        if (!serviceTests)
                            throw new Error(messages_1.errorMissingTestsForService);
                        console.log((0, messages_1.msgTestingService)(serviceName, version));
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
                    (0, consoleOutput_1.consoleOutput)('TestsFailed', failedTestCount);
                    process.exit(1);
                }
                (0, consoleOutput_1.consoleOutput)('TestsFinished');
            }
            catch (error) {
                console.error((0, messages_1.errorWhenTesting)(error.message));
            }
        });
    }
    call(callInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const { serviceName, version, consumerName } = callInput;
            try {
                yield this.callStub(callInput);
                console.log((0, messages_1.msgTestPassed)(serviceName, version, consumerName));
                return true;
            }
            catch (error) {
                console.error((0, messages_1.msgTestFailed)(serviceName, version, consumerName, error.message));
                return false;
            }
        });
    }
    callStub(callInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const { serviceName, version, payload } = callInput;
            const FULL_CONTRACT_FILEPATH = `${this.contractFilePrefix}-${serviceName}-${version}.js`;
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
            const contract = (0, getContract_1.getContract)(contracts, serviceName, version);
            if (!contract) {
                console.warn((0, messages_1.msgContractFileNotFound)(serviceName, version));
                return false;
            }
            const FULL_CONTRACT_FILEPATH = `${this.contractFilePrefix}-${serviceName}-${version}.js`;
            yield (0, createContractFile_1.createContractFile)(contract, FULL_CONTRACT_FILEPATH);
            return true;
        });
    }
    publish() {
        return __awaiter(this, void 0, void 0, function* () {
            const name = this.serviceName;
            const version = this.serviceVersion;
            const { resources, publishing, dependencies } = this.config;
            let { brokerEndpoint } = resources.remote;
            const { publishLocalContracts, publishLocalTests } = publishing;
            if (!brokerEndpoint && (publishLocalContracts || publishLocalTests))
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
                identity: {
                    name: name,
                    version: version
                },
                dependencies,
                contracts,
                tests
            };
            if (process.env.NODE_ENV === 'test')
                process.exit(0);
            if (brokerEndpoint.substring(brokerEndpoint.length - 1) === '/')
                brokerEndpoint = brokerEndpoint.substring(0, brokerEndpoint.length - 1);
            console.log('Publishing...', data);
            yield (0, node_fetch_1.default)(`${brokerEndpoint}/publish`, {
                method: 'POST',
                body: JSON.stringify(data)
            })
                .then((res) => __awaiter(this, void 0, void 0, function* () {
                if (res.status >= 200 && res.status < 300)
                    return yield res.json();
                else
                    console.log(`${messages_1.msgErrorWhenPublishing} --> Status: ${res.status}`);
            }))
                .then(() => __awaiter(this, void 0, void 0, function* () {
                console.log(messages_1.msgSuccessfullyPublished);
                process.exit(0);
            }))
                .catch((error) => {
                console.error((0, messages_1.errorWhenPublishing)(error.message));
            });
        });
    }
}
exports.TripleCheck = TripleCheck;
//# sourceMappingURL=TripleCheck.js.map