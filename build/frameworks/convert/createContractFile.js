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
exports.createContractFile = void 0;
const convertToQuicktype_1 = require("./convertToQuicktype");
const writeContractToDisk_1 = require("./writeContractToDisk");
function createContractFile(contract, fullFilePath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const quicktypeSchema = yield (0, convertToQuicktype_1.convertToQuicktype)(JSON.stringify(contract));
            yield (0, writeContractToDisk_1.writeContractToDisk)(fullFilePath, quicktypeSchema);
        }
        catch (error) {
            console.error(error);
        }
    });
}
exports.createContractFile = createContractFile;
//# sourceMappingURL=createContractFile.js.map