import { checkIfExists } from '../filesystem/checkIfExists';
import { write } from '../filesystem/write';

import { loadDataLocal } from '../load/loadDataLocal';

import { msgJobCompleteInit, msgJobCompleteInitStopped } from '../text/messages';

/**
 * @description Handle basic configuration initialization
 */
export function initConfig(file: any, configPath: string) {
  const FILE_EXISTS = checkIfExists(configPath);

  if (!FILE_EXISTS) {
    let fileContents = JSON.stringify(file, null, ' ');
    /**
     * Convenience: Add name and version from package.json if these exist.
     */
    (() => {
      try {
        const packageJson = loadDataLocal('package.json');
        // @ts-ignore
        if (packageJson && packageJson.name && packageJson.version) {
          // @ts-ignore
          fileContents = fileContents.replace(`"__SERVICE__"`, `"${packageJson.name}"`);
          // @ts-ignore
          fileContents = fileContents.replace(`"__VERSION__"`, `"${packageJson.version}"`);
        }
      } catch (error) {
        return null;
      }
    })();

    write(configPath, fileContents);
    console.log(msgJobCompleteInit);
    return;
  }

  console.log(msgJobCompleteInitStopped);
}
