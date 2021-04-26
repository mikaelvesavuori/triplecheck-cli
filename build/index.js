#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const TripleCheckController_1 = require("./controllers/TripleCheckController");
const initConfig_1 = require("./frameworks/config/initConfig");
const configToInit_1 = require("./frameworks/config/configToInit");
const loadDataLocal_1 = require("./frameworks/load/loadDataLocal");
function main() {
    var _a;
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const [, , ...CLI_ARGS] = process.argv;
            if (((_a = CLI_ARGS[0]) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === 'init')
                initConfig_1.initConfig(configToInit_1.configToInit);
            const config = yield loadDataLocal_1.loadDataLocal('triplecheck.config.json');
            TripleCheckController_1.TripleCheckController(config);
        }
        catch (error) {
            console.error(error);
        }
    });
}
main();
//# sourceMappingURL=index.js.map