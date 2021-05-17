#!/usr/bin/env node
import { TripleCheckController } from './controllers/TripleCheckController';

import { initConfig } from './frameworks/config/initConfig';
import baseConfig from './frameworks/config/baseConfig.json';
import { loadDataLocal } from './frameworks/load/loadDataLocal';
import { checkIfExists } from './frameworks/filesystem/checkIfExists';
import { consoleOutput } from './frameworks/text/consoleOutput';

const CONFIG_FILEPATH = 'triplecheck.config.json';

/**
 * @description Entrypoint for TripleCheck broker.
 */
async function main() {
  try {
    // User wants to init a configuration...
    const [, , ...CLI_ARGS] = process.argv;
    if (CLI_ARGS[0]?.toLowerCase() === 'init') {
      initConfig(baseConfig, CONFIG_FILEPATH);
      process.exit(0);
    }

    if (!checkIfExists(CONFIG_FILEPATH)) {
      consoleOutput('ConfigNotPresent');
      return;
    }

    const config: any = await loadDataLocal(CONFIG_FILEPATH);
    TripleCheckController(config);
  } catch (error) {
    console.error(error);
  }
}

main();
