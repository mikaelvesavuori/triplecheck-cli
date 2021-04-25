export type Config = {
  identity: Identity;
  tests: Tests;
  resources: Resources;
  requestOptions: any; // TODO
  publishing: Publishing;
};

type Identity = {
  version: string;
  type: string;
  name: string;
  endpoint?: string;
};

export type Tests = {
  testScope?: string[];
  excludeScope?: string[];
  verifyLiveEndpoints?: boolean;
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
