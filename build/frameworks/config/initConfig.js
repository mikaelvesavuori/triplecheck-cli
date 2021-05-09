"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initConfig = void 0;
const checkIfExists_1 = require("../filesystem/checkIfExists");
const write_1 = require("../filesystem/write");
const loadDataLocal_1 = require("../load/loadDataLocal");
const messages_1 = require("../text/messages");
function initConfig(file, configPath) {
    const FILE_EXISTS = checkIfExists_1.checkIfExists(configPath);
    if (!FILE_EXISTS) {
        let fileContents = JSON.stringify(file, null, ' ');
        (() => {
            try {
                const packageJson = loadDataLocal_1.loadDataLocal('package.json');
                if (packageJson && packageJson.name && packageJson.version) {
                    fileContents = fileContents.replace(`"__SERVICE__"`, `"${packageJson.name}"`);
                    fileContents = fileContents.replace(`"__VERSION__"`, `"${packageJson.version}"`);
                }
            }
            catch (error) {
                return null;
            }
        })();
        write_1.write(configPath, fileContents);
        console.log(messages_1.msgJobCompleteInit);
        return;
    }
    console.log(messages_1.msgJobCompleteInitStopped);
}
exports.initConfig = initConfig;
//# sourceMappingURL=initConfig.js.map