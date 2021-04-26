#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const TripleCheckController_1 = require("./controllers/TripleCheckController");
const initConfig_1 = require("./frameworks/config/initConfig");
const configToInit_1 = require("./frameworks/config/configToInit");
const loadDataLocal_1 = require("./frameworks/load/loadDataLocal");
function main() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
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