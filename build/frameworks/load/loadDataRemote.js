"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadDataRemote = void 0;
const tslib_1 = require("tslib");
const node_fetch_1 = tslib_1.__importDefault(require("node-fetch"));
function loadDataRemote(url, headers) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        console.log(`Loading data from ${url}...`);
        return yield node_fetch_1.default(url, { method: 'GET', headers }).then((res) => tslib_1.__awaiter(this, void 0, void 0, function* () { return yield res.json(); }));
    });
}
exports.loadDataRemote = loadDataRemote;
//# sourceMappingURL=loadDataRemote.js.map