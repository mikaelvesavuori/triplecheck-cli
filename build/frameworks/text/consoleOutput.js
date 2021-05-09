"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consoleOutput = void 0;
function consoleOutput(output, input) {
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
        console.log(`|- in triplecheck.config.json? -----|`);
        console.log(`|-----------------------------------|`);
    }
    if (output === 'ConfigNotPresent') {
        console.log(`|-----------------------------------|`);
        console.log(`|--- Configuration not present... --|`);
        console.log(`|-------- Generate one with: -------|`);
        console.log(`|----- npx triplecheck-cli init ----|`);
        console.log(`|-----------------------------------|`);
    }
}
exports.consoleOutput = consoleOutput;
//# sourceMappingURL=consoleOutput.js.map