import fetch from 'node-fetch';

import { Config, Resources, Tests } from '../contracts/Config';
import { CallInput } from '../contracts/Call';
import { ConsumerTest, ProviderContract } from '../contracts/Contract';
import { LoadedData } from '../contracts/Data';

import { clean } from '../frameworks/data/clean';

import { validateConfig } from '../frameworks/config/validateConfig';
import { getContract } from '../frameworks/convert/getContract';
import { mergeDatasets } from '../frameworks/data/mergeDatasets';
import { loadDataLocal } from '../frameworks/load/loadDataLocal';
import { loadDataRemote } from '../frameworks/load/loadDataRemote';
import { createContractFile } from '../frameworks/convert/createContractFile';
import { consoleOutput } from '../frameworks/text/consoleOutput';

import {
  msgTestPassed,
  msgTestFailed,
  msgContractFileNotFound,
  msgTestingService,
  msgSuccessfullyPublished,
  errorMissingTestsContracts,
  errorMissingTestsForService,
  errorMissingPublishEndpoint,
  warnMissingConsumerTestData,
  warnMissingPathToLocalContracts,
  warnMissingPathToLocalTests,
  warnMissingContractWhenGeneratingFile,
  warnNothingToPublish
} from '../frameworks/text/messages';

export const createNewTripleCheck = async (config: Config): Promise<TripleCheck> => {
  const tripleCheck = new TripleCheck(config);
  await tripleCheck.init();
  return tripleCheck;
};

/**
 * @description Contract testing utility.
 */
export class TripleCheck {
  serviceName: string | undefined;
  serviceVersion: string | undefined;
  serviceType: string | undefined;
  serviceEndpoint: string | undefined;
  contractFilePath: string | undefined;
  tests: any;
  contracts: any;
  config: Config;

  constructor(config: Config) {
    this.serviceName = config.identity.name;
    this.serviceVersion = config.identity.version;
    this.serviceType = config.identity.type;
    this.serviceEndpoint = config.identity.endpoint || '';
    this.contractFilePath =
      config.tests?.contractFilePath?.replace(/.ts/gi, '') || '__quicktype-contract';
    this.config = config;
  }

  public async init() {
    try {
      const { resources, tests, identity } = this.config;
      let { include } = tests;

      /**
       * Set baseline so we always have include and exclude arrays in case these are missing.
       */
      if (!include) include = [];

      /**
       * In case we have no explicit includes then set the current service as the SUT ("system under test").
       */
      if (include.length === 0) include.push(`${identity.name}@${identity.version}`);

      this.updateTestScopes(include);

      const loadedData = await this.loadData(resources, tests);

      if (!loadedData?.consumerTests || !loadedData?.providerContracts)
        throw new Error(errorMissingTestsContracts);

      // @ts-ignore
      this.updateLoadedResources(loadedData.consumerTests, loadedData.providerContracts);

      validateConfig(this.config);
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * @description TODO
   */
  private updateTestScopes(include: string[]): void {
    this.config.tests.include = include;
  }

  /**
   * @description TODO
   */
  private updateLoadedResources(
    consumerTests: Record<string, unknown>[],
    providerContracts: Record<string, unknown>[]
  ): void {
    this.tests = consumerTests;
    this.contracts = providerContracts;
  }

  /**
   * @description Orchestrator (splitter) method for loading data from remote or local sources.
   */
  private async loadData(resources: Resources, tests: Tests): Promise<LoadedData | null> {
    try {
      const { testsLocal, testsCollection, contractsLocal, contractsCollection } = resources;
      const { include } = tests;
      // Load data from their respective resources
      let consumerTests: any = {};
      let providerContracts: any = {};

      if (testsLocal) {
        const data = loadDataLocal(testsLocal);
        // @ts-ignore
        consumerTests.local = clean(data, include);
      }
      if (testsCollection) {
        const type = 'tests';
        const fetchedTests = await loadDataRemote(type, testsCollection, include);
        if (fetchedTests) consumerTests.remote = fetchedTests;
      }

      if (contractsLocal) {
        const data = loadDataLocal(contractsLocal);
        // @ts-ignore
        providerContracts.local = clean(data, include);
      }
      if (contractsCollection) {
        const type = 'contracts';
        const fetchedContracts = await loadDataRemote(type, contractsCollection, include);
        if (fetchedContracts) providerContracts.remote = fetchedContracts;
      }

      return {
        consumerTests,
        providerContracts
      };
    } catch (error) {
      console.error(`Error when loading data:\n${error.message}`);
      return null;
    }
  }

  /**
   * @description Get cleaned data for testing and publishing.
   * @todo Ensure this takes data correctly; currently uses initial include/exclude arrays
   */
  public async getCleanedData(onlyLocalData?: boolean): Promise<any> {
    const { tests } = this.config;
    const {
      include,
      skipTestingRemoteResources,
      skipTestingLocalResources
      //verifyLiveEndpoints,
    } = tests;

    const providerContracts: any = this.contracts;
    const consumerTests: any = this.tests;
    if (!consumerTests || consumerTests.length === 0) {
      console.warn(warnMissingConsumerTestData);
      return;
    }

    /**
     * Remove excluded items etc
     * If publishing (i.e. only using local data) we sidestep the "include" array, since we don't want that to affect what gets published
     */
    // TODO: Unfuck this mess, either remove this entirely or fix!
    /*
    const trimmedData = trimData(
      {
        consumerTests: consumerTests,
        providerContracts: providerContracts
      },
      onlyLocalData ? [] : include,
      exclude
    );
    */

    const trimmedData = {
      providerContracts,
      consumerTests
    };

    /**
     * Check if we only want local data (i.e. when we want to publish our local/original data)
     */
    if (onlyLocalData) {
      return {
        tests: trimmedData.consumerTests.local,
        contracts: trimmedData.providerContracts.local
      };
    }

    /**
     * Typically in a test scenario we want the merged local and remote datasets
     */
    const mergedTests = (() => {
      if (skipTestingLocalResources) return mergeDatasets([], trimmedData.consumerTests.remote);
      else if (skipTestingRemoteResources)
        return mergeDatasets(trimmedData.consumerTests.local, []);
      else return mergeDatasets(trimmedData.consumerTests.local, trimmedData.consumerTests.remote);
    })();

    const mergedContracts = (() => {
      if (skipTestingLocalResources) return mergeDatasets([], trimmedData.providerContracts.remote);
      else if (skipTestingRemoteResources)
        return mergeDatasets(trimmedData.providerContracts.local, []);
      else
        return mergeDatasets(
          trimmedData.providerContracts.local,
          trimmedData.providerContracts.remote
        );
    })();

    return {
      tests: mergedTests,
      contracts: mergedContracts
    };
  }

  /**
   * @description Run a test suite for loaded consumer contract tests.
   */
  public async test(): Promise<void> {
    try {
      // @ts-ignore
      const { contracts, tests } = await this.getCleanedData();
      //const contracts = this.contracts;
      //const tests = this.tests;
      let failedTestCount = 0;

      if (contracts.length === 0 && tests.length === 0) {
        consoleOutput('ContractsAndTestsMissing');
        return;
      }

      consoleOutput('StartTests');

      // Loop all services that have been passed in
      const _consumerTests = tests.map(async (test: any) => {
        const serviceName = Object.keys(test)[0];
        const versions = Object.keys(test[serviceName]);

        // Loop each individual provided version
        const _versions = versions.map(async (version: any) => {
          const serviceTests = test[serviceName][version];
          if (!serviceTests) throw new Error(errorMissingTestsForService);
          console.log(msgTestingService(serviceName, version));

          // Only test if there actually exists a contract for this version
          const generated = await this.generateContractFile(serviceName, version, contracts);
          if (!generated) return;

          // Run tests for this service and version
          const _serviceTests = serviceTests.map(async (serviceTest: any) => {
            const service = Object.entries(serviceTest)[0];
            const consumerName = service[0];
            const payload = service[1];

            const passed = await this.call({
              serviceName,
              version,
              consumerName,
              payload
            });

            if (!passed) failedTestCount += 1;
          });

          await Promise.all(_serviceTests);
        });

        await Promise.all(_versions);
      });

      await Promise.all(_consumerTests);

      if (failedTestCount > 0) {
        consoleOutput('TestsFailed', failedTestCount);
        process.exit(1);
      }

      consoleOutput('TestsFinished');
      process.exit(0);
    } catch (error) {
      console.error(`Error when testing:\n ${error.message}`);
    }
  }

  /**
   * @description "Test call" a named service's contract with a given payload.
   * Returns boolean reflecting if it passed successfully or not.
   */
  private async call(callInput: CallInput): Promise<boolean> {
    const { serviceName, version, consumerName } = callInput;

    try {
      await this.callStub(callInput);
      console.log(msgTestPassed(serviceName, version, consumerName));
      return true;
    } catch (error) {
      console.error(msgTestFailed(serviceName, version, consumerName, error.message));
      return false;
    }
  }

  /**
   * @description Call a stub of the service, i.e. the Quicktype-converted variant to check if they both match.
   */
  private async callStub(callInput: CallInput) {
    const { serviceName, version, payload } = callInput;

    const FULL_CONTRACT_FILEPATH = `${this.contractFilePath}-${serviceName}-${version}.js`;
    const contract = await import(`${process.cwd()}/${FULL_CONTRACT_FILEPATH}`);
    // Attempt to convert and cross-check the contract with the payload
    contract.toContract(JSON.stringify(payload));
  }

  /**
   * @description Call mock server version of stored response from the actual service.
   * @todo
   */
  //private async callMock() {
  //  console.log('Not yet implemented');
  //}

  /**
   * @description Call the actual service.
   * @todo
   */
  //private async callActual() {
  //  console.log('Not yet implemented');
  //}

  /**
   * @description Orchestrator method to generate contract file.
   */
  private async generateContractFile(
    serviceName: string,
    version: string,
    contracts: any[]
  ): Promise<boolean> {
    if (!contracts || contracts.length === 0) {
      console.warn(warnMissingContractWhenGeneratingFile);
      return false;
    }
    // Get the right provider contract
    const contract = getContract(contracts, serviceName, version);
    if (!contract) {
      console.warn(msgContractFileNotFound(serviceName, version));
      return false;
    }

    // Create and load the local, converted contract file
    const FULL_CONTRACT_FILEPATH = `${this.contractFilePath}-${serviceName}-${version}.js`;
    await createContractFile(contract, FULL_CONTRACT_FILEPATH);
    return true;
  }

  /**
   * @description Use the TripleCheck data service to publish [add/update] our (consumer) contracts.
   * Expects that you point to an API, such as the TripleCheck data service.
   */
  public async publish(): Promise<void> {
    const name = this.serviceName;
    const version = this.serviceVersion;
    const type = this.serviceType;
    const { resources, publishing } = this.config;
    const { contractsLocal, testsLocal } = resources;

    if (!contractsLocal) console.warn(warnMissingPathToLocalContracts);
    if (!testsLocal) console.warn(warnMissingPathToLocalTests);

    const { brokerEndpoint, publishLocalContracts, publishLocalTests } = publishing;
    if (!brokerEndpoint) throw new Error(errorMissingPublishEndpoint);

    if (!publishLocalContracts && !publishLocalTests) {
      console.warn(warnNothingToPublish);
      return;
    }

    let { contracts, tests } = await this.getCleanedData(true);
    if (!publishLocalContracts) contracts = [];
    if (!publishLocalTests) tests = [];

    const data = {
      version,
      type,
      name,
      contracts,
      tests
    };

    if (process.env.NODE_ENV === 'test') return; // TODO: Consider using a mock instead

    await fetch(brokerEndpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    })
      .then(() => {
        console.log(msgSuccessfullyPublished);
      })
      .catch((error) => {
        console.error(`Error when publishing:\n${error.message}`);
      });

    process.exit(0);
  }
}
