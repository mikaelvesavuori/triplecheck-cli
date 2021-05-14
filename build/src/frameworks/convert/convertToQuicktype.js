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
exports.convertToQuicktype = void 0;
const quicktype_core_1 = require("quicktype-core");
function convertToQuicktype(schema) {
    return __awaiter(this, void 0, void 0, function* () {
        const targetLanguage = 'javascript';
        const name = 'Contract';
        const inputData = new quicktype_core_1.InputData();
        if (JSON.parse(schema).hasOwnProperty('properties')) {
            const schemaInput = yield generateJsonSchemaInput(name, schema);
            inputData.addInput(schemaInput);
        }
        else {
            const jsonInput = yield generateJsonInput(targetLanguage, name, schema);
            inputData.addInput(jsonInput);
        }
        return yield quicktype_core_1.quicktype({
            inputData,
            lang: targetLanguage
        });
    });
}
exports.convertToQuicktype = convertToQuicktype;
const generateJsonSchemaInput = (name, schema) => __awaiter(void 0, void 0, void 0, function* () {
    const schemaInput = new quicktype_core_1.JSONSchemaInput(new quicktype_core_1.JSONSchemaStore());
    yield schemaInput.addSource({ name, schema });
    return schemaInput;
});
const generateJsonInput = (targetLanguage, name, schema) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonInput = quicktype_core_1.jsonInputForTargetLanguage(targetLanguage);
    yield jsonInput.addSource({
        name,
        samples: [schema]
    });
    return jsonInput;
});
//# sourceMappingURL=convertToQuicktype.js.map