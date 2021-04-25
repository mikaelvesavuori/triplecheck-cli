import { Config } from '../../contracts/Config';

/**
 * @description Ensure configuration is formatted as per our business logic.
 */
export function validateConfig(config: Config) {
  if (!config) throw new Error('Missing config!');
  /*
  if (!config.remoteData && !config.providerContracts)
    throw new Error(
      'Field "providerContracts" is required if not fetching from a remote data source!'
    );

  if (config.remoteData && !config.dataUrl)
    throw new Error('Field "dataUrl" is required if "remoteData" is set to "true"!');
  */
}
