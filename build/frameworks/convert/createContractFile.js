"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContractFile = void 0;
const tslib_1 = require("tslib");
const convertToQuicktype_1 = require("./convertToQuicktype");
const writeContractToDisk_1 = require("./writeContractToDisk");
function createContractFile(contract, fullFilePath) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const quicktypeSchema = yield convertToQuicktype_1.convertToQuicktype(JSON.stringify(contract));
            yield writeContractToDisk_1.writeContractToDisk(fullFilePath, quicktypeSchema);
        }
        catch (error) {
            console.error(error);
        }
    });
}
exports.createContractFile = createContractFile;
//# sourceMappingURL=createContractFile.js.map