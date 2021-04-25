"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeContractToDisk = void 0;
const tslib_1 = require("tslib");
const fs_1 = require("fs");
function writeContractToDisk(contractFilePath, quicktypeSchema) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const writeStream = fs_1.createWriteStream(contractFilePath);
            quicktypeSchema.lines.forEach((value) => writeStream.write(`${value}\n`));
            writeStream.on('finish', () => resolve('Done'));
            writeStream.on('error', () => reject());
            writeStream.end();
        });
    });
}
exports.writeContractToDisk = writeContractToDisk;
//# sourceMappingURL=writeContractToDisk.js.map