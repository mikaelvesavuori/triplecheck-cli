"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadDataLocal = void 0;
const tslib_1 = require("tslib");
function loadDataLocal(filePath) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const path = `${process.cwd()}/${filePath}`;
        console.log(`Loading file from ${path}...`);
        const file = yield Promise.resolve().then(() => tslib_1.__importStar(require(path)));
        const data = file.default || file;
        if (!data)
            throw new Error('No data loaded!');
        return data;
    });
}
exports.loadDataLocal = loadDataLocal;
//# sourceMappingURL=loadDataLocal.js.map