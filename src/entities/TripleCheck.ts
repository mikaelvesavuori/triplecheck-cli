import fetch from 'node-fetch';

import { Config, Resources, Tests } from '../contracts/Config';
import { CallInput } from '../contracts/Call';
import { LoadedData } from '../contracts/Data';

import { clean } from '../frameworks/data/clean';

import { validateConfig } from '../frameworks/config/validateConfig';
import { getContract } from '../frameworks/convert/getContract';
import { mergeDatasets } from '../frameworks/data/mergeDatasets';
import { loadDataLocal } from '../frameworks/load/loadDataLocal';
import { loadDataRemote } from '../frameworks/load/loadDataRemote';
import { createContractFile } from '../frameworks/convert/createContractFile';
import { consoleOutput } from '../frameworks/text/consoleOutput';

import { mockedLoadedData } from '../../__testdata__/mockedLoadedData';

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
  contractFilePrefix: string | undefined;
  tests: any;
  contracts: any;
  config: Config;

  constructor(config: Config) {
    this.serviceName = config.identity.name;
    this.serviceVersion = config.identity.version;
    this.contractFilePrefix =
      config.tests?.contractFilePrefix?.replace(/.ts/gi, '') || '__quicktype-contract';
    this.config = config;
  }

  public async init() {
    try {
      const { identity, tests, resources } = this.config;
      const { skipIncludingDependents } = tests;
      let { include } = tests;

      /**
       * Set baseline so we always have the include array in case this is missing.
       */
      if (!include) include = [];

      /**
       * In case we have no explicit includes then set the current service as the SUT ("system under test").
       */
      if (include.length === 0) include.push(`${identity.name}@${identity.version}`);

      /**
       * If we have a broker endpoint, and unless the user explicitly does not disallow it, we will
       * get all dependent services for our include list.
       */
      if (resources.remote?.brokerEndpoint && !skipIncludingDependents) {
        // @ts-ignore
        const dependents: string[] = await this.getDependents(resources.remote.brokerEndpoint, [
          `${identity.name}@${identity.version}`
        ]);
        const dedupedFinalIncludes = Array.from(new Set([...include, ...dependents]));
        this.updateTestScopes(dedupedFinalIncludes);
      } else this.updateTestScopes(include);

      // Handle fake data if we are running tests
      if (process.env.NODE_ENV === 'test') {
        const loadedData = mockedLoadedData;
        // @ts-ignore
        this.updateLoadedResources(loadedData.consumerTests, loadedData.providerContracts);
      } else {
        const loadedData = await this.loadData(resources, tests);

        if (!loadedData?.consumerTests || !loadedData?.providerContracts)
          throw new Error(errorMissingTestsContracts);

        // @ts-ignore
        this.updateLoadedResources(loadedData.consumerTests, loadedData.providerContracts);
      }

      if (!validateConfig(this.config)) process.exit(1);
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * @description Set and update testing scope to provided include list.
   */
  private updateTestScopes(include: string[]): void {
    this.config.tests.include = include;
  }

  /**
   * @description Set and update loaded resources.
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
      let localTests,
        localContracts,
        brokerEndpoint = undefined;

      const { include, skipTestingLocalResources, skipTestingRemoteResources } = tests;
      const { local, remote } = resources;

      if (local) {
        localTests = local.testsPath;
        localContracts = local.contractsPath;
      }

      if (remote) brokerEndpoint = remote.brokerEndpoint;

      // Load data from their respective resources
      let consumerTests: any = {};
      let providerContracts: any = {};

      // Tests
      if (!skipTestingLocalResources && localTests) {
        const data = loadDataLocal(localTests);
        consumerTests.local = clean(data, include || []);
      }
      if (!skipTestingRemoteResources && brokerEndpoint) {
        const fetchedTests = await loadDataRemote('tests', brokerEndpoint, include);
        if (fetchedTests) consumerTests.remote = fetchedTests;
      }

      // Contracts
      if (!skipTestingLocalResources && localContracts) {
        const data = loadDataLocal(localContracts);
        providerContracts.local = clean(data, include || []);
      }
      if (!skipTestingRemoteResources && brokerEndpoint) {
        const fetchedContracts = await loadDataRemote('contracts', brokerEndpoint, include);
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
   * @description Get list of services that are dependent on the service we are testing.
   * This assumes that there is a broker available.
   */
  async getDependents(brokerEndpoint: string, dependencies: string[]) {
    return loadDataRemote('dependents', brokerEndpoint, dependencies);
  }

  /**
   * @description Get cleaned data for testing and publishing.
   */
  public async getCleanedData(onlyLocalData?: boolean): Promise<any> {
    const { tests } = this.config;
    const { skipTestingRemoteResources, skipTestingLocalResources } = tests;

    const providerContracts: any = this.contracts;
    const consumerTests: any = this.tests;
    if (!consumerTests || consumerTests.length === 0) {
      console.warn(warnMissingConsumerTestData);
      return;
    }

    /**
     * Check if we only want local data (i.e. when we want to test/publish our local/original data)
     */
    if (onlyLocalData) {
      return {
        tests: consumerTests.local,
        contracts: providerContracts.local
      };
    }

    /**
     * Typically in a test scenario we want the merged local and remote datasets
     */
    const mergedTests = (() => {
      if (skipTestingLocalResources) return mergeDatasets([], consumerTests.remote);
      else if (skipTestingRemoteResources) return mergeDatasets(consumerTests.local, []);
      else return mergeDatasets(consumerTests.local, consumerTests.remote);
    })();

    const mergedContracts = (() => {
      if (skipTestingLocalResources) return mergeDatasets([], providerContracts.remote);
      else if (skipTestingRemoteResources) return mergeDatasets(providerContracts.local, []);
      else return mergeDatasets(providerContracts.local, providerContracts.remote);
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

    const FULL_CONTRACT_FILEPATH = `${this.contractFilePrefix}-${serviceName}-${version}.js`;
    const contract = await import(`${process.cwd()}/${FULL_CONTRACT_FILEPATH}`);
    // Attempt to convert and cross-check the contract with the payload
    contract.toContract(JSON.stringify(payload));
  }

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
    const FULL_CONTRACT_FILEPATH = `${this.contractFilePrefix}-${serviceName}-${version}.js`;
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
    const { resources, publishing } = this.config;

    // @ts-ignore
    const { brokerEndpoint } = resources.remote;
    if (!brokerEndpoint) throw new Error(errorMissingPublishEndpoint);

    const { publishLocalContracts, publishLocalTests } = publishing;
    if (!publishLocalContracts && !publishLocalTests) {
      console.warn(warnNothingToPublish);
      return;
    }

    let { contracts, tests } = await this.getCleanedData(true);
    if (!publishLocalContracts) contracts = [];
    if (!publishLocalTests) tests = [];

    const data = {
      version,
      name,
      contracts,
      tests
    };

    if (process.env.NODE_ENV === 'test') process.exit(0);

    await fetch(`${brokerEndpoint}/publish`, {
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
