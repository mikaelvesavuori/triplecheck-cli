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
exports.loadDataRemote = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const messages_1 = require("../../frameworks/text/messages");
function loadDataRemote(type, url, include, headers) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log((0, messages_1.msgLoadingRemote)(url));
        if (include && include.length > 0) {
            const fetchPromises = include.map((service) => __awaiter(this, void 0, void 0, function* () {
                return (0, node_fetch_1.default)(`${url}/${type}?${service}`, { method: 'GET', headers }).then((res) => __awaiter(this, void 0, void 0, function* () { return res.json(); }));
            }));
            const resolved = yield Promise.all(fetchPromises);
            if (type === 'dependents')
                return resolved[0];
            let cleaned = resolved.map((item) => item[0]);
            cleaned = cleaned.filter((item) => item);
            const finalizedData = {};
            cleaned.forEach((item) => {
                if (finalizedData[Object.keys(item)[0]]) {
                    const existingData = finalizedData[Object.keys(item)[0]];
                    finalizedData[Object.keys(item)[0]] = Object.assign(existingData, Object.values(item)[0]);
                }
                else
                    finalizedData[Object.keys(item)[0]] = Object.values(item)[0];
            });
            return [finalizedData];
        }
    });
}
exports.loadDataRemote = loadDataRemote;
//# sourceMappingURL=loadDataRemote.js.map