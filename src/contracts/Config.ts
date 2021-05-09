export type Config = {
  identity: Identity;
  tests: Tests;
  resources: Resources;
  publishing: Publishing;
};

type Identity = {
  version: string;
  type: string;
  name: string;
  endpoint?: string;
};

export type Tests = {
  include?: string[];
  skipTestingRemoteResources?: boolean;
  skipTestingLocalResources?: boolean;
  contractFilePath?: string;
};

export type Resources = {
  contractsLocal?: string;
  contractsCollection?: string;
  testsLocal?: string;
  testsCollection?: string;
};

type Publishing = {
  brokerEndpoint: string;
  publishLocalContracts: boolean;
  publishLocalTests: boolean;
};
