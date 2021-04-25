import { TripleCheckController } from './controllers/TripleCheckController';

import { initConfig } from './frameworks/config/initConfig';
import { configToInit } from './frameworks/config/configToInit';
import { loadDataLocal } from './frameworks/load/loadDataLocal';

async function main() {
  try {
    // User wants to init a configuration...
    const [, , ...CLI_ARGS] = process.argv;
    if (CLI_ARGS[0]?.toLowerCase() === 'init') initConfig(configToInit);

    const config: any = await loadDataLocal('triplecheck.config.json');
    TripleCheckController(config);
  } catch (error) {
    console.error(error);
  }
}

main();
