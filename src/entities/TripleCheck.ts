import fetch from 'node-fetch';

import { Config, Resources } from '../contracts/Config';
import { CallInput } from '../contracts/Call';
import { ConsumerTest, ProviderContract } from '../contracts/Contract';
import { LoadedData } from '../contracts/Data';

import { validateConfig } from '../frameworks/config/validateConfig';
import { getContract } from '../frameworks/convert/getContract';
import { trimData } from '../frameworks/data/trimData';
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
      const { resources } = this.config;
      const loadedData = await this.loadData(resources);

      if (!loadedData?.consumerTests || !loadedData?.providerContracts)
        throw new Error(errorMissingTestsContracts);

      this.tests = loadedData?.consumerTests;
      this.contracts = loadedData?.providerContracts;

      validateConfig(this.config);
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * @description Orchestrator (splitter) method for loading data from remote or local source.
   */
  private async loadData(resources: Resources): Promise<LoadedData | null> {
    try {
      const { testsLocal, testsCollection, contractsLocal, contractsCollection } = resources;
      // Load data from their respective resources
      let consumerTests: any = {};
      let providerContracts: any = {};

      if (testsLocal) consumerTests.local = await loadDataLocal(testsLocal);

      // TODO: Add support to more selectively fetch data for services, by for example passing in "testScope"
      if (testsCollection) {
        const fetchedTests = await loadDataRemote(testsCollection);
        if (fetchedTests) consumerTests.remote = fetchedTests;
      }

      if (contractsLocal) providerContracts.local = await loadDataLocal(contractsLocal);

      if (contractsCollection) {
        const fetchedContracts = await loadDataRemote(contractsCollection);
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
   */
  public async getData(onlyLocalData?: boolean): Promise<any> {
    const { tests } = this.config;

    const {
      testScope,
      excludeScope,
      skipTestingRemoteResources,
      skipTestingLocalResources
      //verifyLiveEndpoints,
    } = tests;

    const providerContracts: ProviderContract[] = this.contracts;
    const consumerTests: ConsumerTest[] = this.tests;
    if (!consumerTests || consumerTests.length === 0) {
      console.warn(warnMissingConsumerTestData);
      return;
    }

    /**
     * Remove excluded items etc
     * If publishing (i.e. only using local data) we sidestep testScope, since we don't want that to affect what gets published
     */
    const trimmedData = trimData(
      {
        consumerTests: consumerTests,
        providerContracts: providerContracts
      },
      onlyLocalData ? [] : testScope,
      excludeScope
    );

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
      const { contracts, tests } = await this.getData();

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

            await this.call({
              serviceName,
              version,
              consumerName,
              payload
            });
          });

          await Promise.all(_serviceTests);
        });

        await Promise.all(_versions);
      });

      await Promise.all(_consumerTests);

      console.log(`\n`);
      consoleOutput('TestsFinished');
      process.exit(0);
    } catch (error) {
      console.error(`Error when testing:\n ${error.message}`);
    }
  }

  /**
   * @description "Test call" a named service's contract with a given payload.
   */
  private async call(callInput: CallInput): Promise<void> {
    const { serviceName, version, consumerName } = callInput;

    try {
      await this.callStub(callInput);
      console.log(msgTestPassed(serviceName, version, consumerName));
    } catch (error) {
      console.error(msgTestFailed(serviceName, version, consumerName));
      console.log(`\n`);
      consoleOutput('TestsFailed');
      process.exit(1);
    }
  }

  /**
   * @description Call a stub of the service, i.e. the Quicktype-converted variant to check if they both match.
   */
  private async callStub(callInput: CallInput) {
    const { serviceName, version, payload } = callInput;

    const FULL_CONTRACT_FILEPATH = `${this.contractFilePath}-${serviceName}-${version}.ts`;
    const contract = await import(`${process.cwd()}/${FULL_CONTRACT_FILEPATH}`);
    const { Convert } = contract;

    // Attempt to convert and cross-check the contract with the payload
    Convert.toContract(JSON.stringify(payload));
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
    const FULL_CONTRACT_FILEPATH = `${this.contractFilePath}-${serviceName}-${version}.ts`;
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

    let { contracts, tests } = await this.getData(true);
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
