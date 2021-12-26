import { ConsoleOutput } from '../../contracts/ConsoleOutput';

/**
 * @description Utility function to output more visual messaging to the message prompt
 */
export function consoleOutput(output: ConsoleOutput, input?: number) {
  if (output === 'StartTests') {
    console.log(`|-----------------------------------|`);
    console.log(`|-------- Starting tests... --------|`);
    console.log(`|-----------------------------------|`);
  }

  if (output === 'TestsFinished') {
    console.log(`|-----------------------------------|`);
    console.log(`|--- Tests finished successfully ---|`);
    console.log(`|-----------------------------------|`);
  }

  if (output === 'TestsFailed') {
    console.log(`|-----------------------------------|`);
    console.log(`|--------- Tests failed: ${input} ---------|`);
    console.log(`|-----------------------------------|`);
  }

  if (output === 'ContractsAndTestsMissing') {
    console.log(`|-----------------------------------|`);
    console.log(`|- Contracts and tests missing... --|`);
    console.log(`|- Did you forget to specify them --|`);
    console.log(`|- in triplecheck.config.json, -----|`);
    console.log(`|- or is your include array empty? -|`);
    console.log(`|-----------------------------------|`);
  }

  if (output === 'ConfigNotPresent') {
    console.log(`|-----------------------------------|`);
    console.log(`|--- Configuration not present... --|`);
    console.log(`|-------- Generate one with: -------|`);
    console.log(`|------- npx triplecheck init ------|`);
    console.log(`|-----------------------------------|`);
  }
}
