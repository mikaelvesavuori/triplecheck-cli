import { ConsoleOutput } from '../../contracts/ConsoleOutput';

/**
 * @description Utility function to output more visual messaging to the message prompt
 */
export function consoleOutput(output: ConsoleOutput) {
  if (output === 'StartTests') {
    console.log(`|-----------------------------------|`);
    console.log(`|-------- Starting tests... --------|`);
    console.log(`|-----------------------------------|`);
    console.log(`\n`);
  }

  if (output === 'TestsFinished') {
    console.log(`|-----------------------------------|`);
    console.log(`|--- Tests finished successfully ---|`);
    console.log(`|-----------------------------------|`);
    console.log(`\n`);
  }

  if (output === 'TestsFailed') {
    console.log(`|-----------------------------------|`);
    console.log(`|---------- Tests failed -----------|`);
    console.log(`|-----------------------------------|`);
    console.log(`\n`);
  }
}
