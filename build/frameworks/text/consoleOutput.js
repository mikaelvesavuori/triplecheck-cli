"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consoleOutput = void 0;
function consoleOutput(output) {
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
exports.consoleOutput = consoleOutput;
//# sourceMappingURL=consoleOutput.js.map