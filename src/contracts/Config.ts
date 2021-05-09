export type Config = {
  identity: Identity;
  tests: Tests;
  resources: Resources;
  publishing: Publishing;
};

/**
 * TODO
 */
type Identity = {
  /**
   * Name of your service. If you generate a configuration with the "init" flag this will be picked up from
   * your package.json file, if you have one.
   * @example "my-service"
   */
  name: string;
  /**
   * Version of your service. If you generate a configuration with the "init" flag this will be picked up from
   * your package.json file, if you have one.
   * @example "1.0.0"
   */
  version: string;
};

/**
 * TODO
 */
export type Tests = {
  /**
   * An array of strings that specify what services and versions we want to test.
   * @example ["api-service@1.0.0", "some-other-service@2.1.5"]
   */
  include?: string[];
  /**
   * Should we skip testing tests found on a remote resource?
   */
  skipTestingRemoteResources?: boolean;
  /**
   * Should we skip testing tests found locally?
   */
  skipTestingLocalResources?: boolean;
  /**
   * An option to specify what the temporary generated contract file will be prefixed as.
   * The contract itself will be generated as a TypeScript (.ts) file.
   * You should remove any generated contracts in-between test runs to ensure you have
   * no conflicts with old data.
   * @example "__quicktype-contract"
   */
  contractFilePrefix?: string;
};

/**
 * Resources specify where we can find the things we need: local tests/contracts and a broker, for example.
 */
export type Resources = {
  local?: {
    /**
     * Where are you storing local contracts? These should be stored in an array of objects, all collected in a single file.
     * @example "./contracts/contracts.json"
     */
    contractsPath?: string;
    /**
     * Where are you storing local tests? These should be stored in an array of objects, all collected in a single file.
     * @example "./tests/tests.json"
     */
    testsPath?: string;
  };
  remote?: {
    /**
     * TODO
     * @example "https://my-broker-service.com/api/"
     */
    brokerEndpoint?: string;
  };
};

/**
 * TODO
 */
type Publishing = {
  /**
   * Should we publish any contracts we store locally?
   */
  publishLocalContracts: boolean;
  /**
   * Should we publish any tests we store locally?
   */
  publishLocalTests: boolean;
};
