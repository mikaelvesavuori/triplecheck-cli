export type Config = {
  identity: Identity;
  dependencies: Dependency[];
  tests: Tests;
  resources: Resources;
  publishing: Publishing;
};

/**
 * Basic service identity data.
 */
export type Identity = {
  /**
   * Name of your service. If you generate a configuration with the "init" flag this will be picked up from
   * your package.json file, if you have one.
   * @example "my-service"
   */
  name: string;
  /**
   * Version of your service. If you generate a configuration with the `init` flag this will be picked up from
   * your package.json file, if you have one.
   * @example "1.0.0"
   */
  version: string;
};

/**
 * A dependency is how we list service we depend on. These will be also be added in addition to anything
 * listed in the `tests.include` block. This is a required array—think of this as the long-term way of
 * stating dependencies. When you publish, relations _will_ be inferred for/from any services listed here.
 * @example ["api-service@1.0.0", "some-other-service@2.1.5"]
 */
export type Dependency = string;

/**
 * Test setup.
 */
export type Tests = {
  /**
   * An array of strings that specify what services and versions we want to test. Note that these are _in addition_
   * to those listed in `dependencies`. This is an optional array—think of it as a temporary way of adding services
   * you want to test, for example in CI. When you publish, the relations will not be inferred from services present
   * here.
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
     * Where is the broker located?
     * @example "https://my-broker-service.com/api/"
     */
    brokerEndpoint?: string;
  };
};

/**
 * Publishing setup.
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
