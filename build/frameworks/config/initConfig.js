"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initConfig = void 0;
const checkIfExists_1 = require("../filesystem/checkIfExists");
const write_1 = require("../filesystem/write");
const FILE = 'triplecheck.config.js';
function initConfig(file) {
    const FILE_EXISTS = checkIfExists_1.checkIfExists(FILE);
    if (!FILE_EXISTS) {
        let fileContents = `import { version } from './package.json';\n\nexport const config = ` +
            JSON.stringify(file, null, ' ');
        fileContents = fileContents.replace('"__VERSION__"', 'version');
        write_1.write(FILE, fileContents);
        console.log('MsgJobCompleteInit');
        return;
    }
    console.log('MsgJobCompleteInitStopped');
}
exports.initConfig = initConfig;
//# sourceMappingURL=initConfig.js.map