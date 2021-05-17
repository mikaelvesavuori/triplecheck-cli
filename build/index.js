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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TripleCheckController_1 = require("./controllers/TripleCheckController");
const initConfig_1 = require("./frameworks/config/initConfig");
const baseConfig_json_1 = __importDefault(require("./frameworks/config/baseConfig.json"));
const loadDataLocal_1 = require("./frameworks/load/loadDataLocal");
const checkIfExists_1 = require("./frameworks/filesystem/checkIfExists");
const consoleOutput_1 = require("./frameworks/text/consoleOutput");
const CONFIG_FILEPATH = 'triplecheck.config.json';
function main() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [, , ...CLI_ARGS] = process.argv;
            if (((_a = CLI_ARGS[0]) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === 'init') {
                initConfig_1.initConfig(baseConfig_json_1.default, CONFIG_FILEPATH);
                process.exit(0);
            }
            if (!checkIfExists_1.checkIfExists(CONFIG_FILEPATH)) {
                consoleOutput_1.consoleOutput('ConfigNotPresent');
                return;
            }
            const config = yield loadDataLocal_1.loadDataLocal(CONFIG_FILEPATH);
            TripleCheckController_1.TripleCheckController(config);
        }
        catch (error) {
            console.error(error);
        }
    });
}
main();
//# sourceMappingURL=index.js.map