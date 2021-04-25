import { checkIfExists } from '../filesystem/checkIfExists';
import { write } from '../filesystem/write';

const FILE = 'triplecheck.config.js';

/**
 * @description Handle basic configuration initialization
 * @todo Fix messages
 */
export function initConfig(file: any) {
  const FILE_EXISTS = checkIfExists(FILE);
  if (!FILE_EXISTS) {
    let fileContents =
      `import { version } from './package.json';\n\nexport const config = ` +
      JSON.stringify(file, null, ' ');
    fileContents = fileContents.replace('"__VERSION__"', 'version');

    write(FILE, fileContents);
    console.log('MsgJobCompleteInit');
    return;
  }
  console.log('MsgJobCompleteInitStopped');
}
