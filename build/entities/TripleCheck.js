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
const validateConfig_1 = require("../frameworks/config/validateConfig");
const getContract_1 = require("../frameworks/convert/getContract");
const trimData_1 = require("../frameworks/data/trimData");
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
                const { resources } = this.config;
                const loadedData = yield this.loadData(resources);
                if (!(loadedData === null || loadedData === void 0 ? void 0 : loadedData.consumerTests) || !(loadedData === null || loadedData === void 0 ? void 0 : loadedData.providerContracts))
                    throw new Error(messages_1.errorMissingTestsContracts);
                this.tests = loadedData === null || loadedData === void 0 ? void 0 : loadedData.consumerTests;
                this.contracts = loadedData === null || loadedData === void 0 ? void 0 : loadedData.providerContracts;
                validateConfig_1.validateConfig(this.config);
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    loadData(resources) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { testsLocal, testsCollection, contractsLocal, contractsCollection } = resources;
                let consumerTests = {};
                let providerContracts = {};
                if (testsLocal)
                    consumerTests.local = yield loadDataLocal_1.loadDataLocal(testsLocal);
                if (testsCollection) {
                    const fetchedTests = yield loadDataRemote_1.loadDataRemote(testsCollection);
                    if (fetchedTests)
                        consumerTests.remote = fetchedTests;
                }
                if (contractsLocal)
                    providerContracts.local = yield loadDataLocal_1.loadDataLocal(contractsLocal);
                if (contractsCollection) {
                    const fetchedContracts = yield loadDataRemote_1.loadDataRemote(contractsCollection);
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
    getData(onlyLocalData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tests } = this.config;
            const { testScope, excludeScope, skipTestingRemoteResources, skipTestingLocalResources } = tests;
            const providerContracts = this.contracts;
            const consumerTests = this.tests;
            if (!consumerTests || consumerTests.length === 0) {
                console.warn(messages_1.warnMissingConsumerTestData);
                return;
            }
            const trimmedData = trimData_1.trimData({
                consumerTests: consumerTests,
                providerContracts: providerContracts
            }, onlyLocalData ? [] : testScope, excludeScope);
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
                const { contracts, tests } = yield this.getData();
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
                            yield this.call({
                                serviceName,
                                version,
                                consumerName,
                                payload
                            });
                        }));
                        yield Promise.all(_serviceTests);
                    }));
                    yield Promise.all(_versions);
                }));
                yield Promise.all(_consumerTests);
                console.log(`\n`);
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
            }
            catch (error) {
                console.log('error', error);
                console.error(messages_1.msgTestFailed(serviceName, version, consumerName));
                console.log(`\n`);
                consoleOutput_1.consoleOutput('TestsFailed');
                process.exit(1);
            }
        });
    }
    callStub(callInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const { serviceName, version, payload } = callInput;
            const FULL_CONTRACT_FILEPATH = `${this.contractFilePath}-${serviceName}-${version}.js`;
            console.log('--->', `${process.cwd()}/${FULL_CONTRACT_FILEPATH}`);
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
            let { contracts, tests } = yield this.getData(true);
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