import { Config, Identity } from '../../contracts/Config';

import {
  warnPublishingWithNoLocals,
  warnMissingPathToLocalContracts,
  warnMissingPathToLocalTests,
  warnPublishingWithNoEndpoint,
  errorInvalidIdentity
} from '../../frameworks/text/messages';

/**
 * @description Ensure configuration is formatted as per our business logic.
 */
export function validateConfig(config: Config): boolean {
  if (!config) throw new Error('Missing config!');

  const isIdentityValid = validateIdentity(config.identity);
  if (!isIdentityValid) {
    console.error(errorInvalidIdentity);
    return false;
  }

  if (!config.resources.local) console.warn(warnPublishingWithNoLocals);

  if (config.resources.local) {
    const { contractsPath, testsPath } = config.resources.local;
    if (!contractsPath) console.warn(warnMissingPathToLocalContracts);
    if (!testsPath) console.warn(warnMissingPathToLocalTests);
  }

  if (!config.resources.remote) console.warn(warnPublishingWithNoEndpoint);

  return true;
}

/**
 * @description Validate identity block (name and version).
 */
const validateIdentity = (identity: Identity) => {
  // Allow only lowercase characters and hyphens
  const nameRegex = /^[a-z]+(-[a-z]+)*$/;
  // Allow only semantic version style (for example 1.5.0)
  // Reference implementation from: https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
  const versionRegex =
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
  if (identity.name.match(nameRegex) && identity.version.match(versionRegex)) return true;
  else return false;
};
