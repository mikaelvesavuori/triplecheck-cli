"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadDataLocal = void 0;
const fs = __importStar(require("fs"));
const messages_1 = require("../../frameworks/text/messages");
function loadDataLocal(filePath) {
    const path = `${process.cwd()}/${filePath}`;
    console.log(messages_1.msgLoadingLocal(path));
    let file = fs.readFileSync(path, 'utf8');
    file = isJsonString(file) ? JSON.parse(file) : file;
    if (!file)
        throw new Error('No data loaded!');
    return file;
}
exports.loadDataLocal = loadDataLocal;
const isJsonString = (str) => {
    try {
        JSON.parse(str);
    }
    catch (e) {
        return false;
    }
    return true;
};
//# sourceMappingURL=loadDataLocal.js.map