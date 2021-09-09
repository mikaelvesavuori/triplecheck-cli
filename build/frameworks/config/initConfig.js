"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initConfig = void 0;
const checkIfExists_1 = require("../filesystem/checkIfExists");
const write_1 = require("../filesystem/write");
const loadDataLocal_1 = require("../load/loadDataLocal");
const messages_1 = require("../text/messages");
function initConfig(file, configPath) {
    if (!file || !configPath)
        throw new Error('Missing file and/or configPath in initConfig!');
    const FILE_EXISTS = (0, checkIfExists_1.checkIfExists)(configPath);
    if (!FILE_EXISTS) {
        let fileContents = JSON.stringify(file, null, ' ');
        (() => {
            try {
                const packageJson = (0, loadDataLocal_1.loadDataLocal)('package.json');
                if (packageJson && packageJson.name && packageJson.version) {
                    fileContents = fileContents.replace(`"__SERVICE__"`, `"${packageJson.name}"`);
                    fileContents = fileContents.replace(`"__VERSION__"`, `"${packageJson.version}"`);
                }
            }
            catch (error) { }
        })();
        (0, write_1.write)(configPath, fileContents);
        console.log(messages_1.msgJobCompleteInit);
        return true;
    }
    console.log(messages_1.msgJobCompleteInitStopped);
    return false;
}
exports.initConfig = initConfig;
//# sourceMappingURL=initConfig.js.map