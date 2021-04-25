"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToQuicktype = void 0;
const tslib_1 = require("tslib");
const quicktype_core_1 = require("quicktype-core");
function convertToQuicktype(schema) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const targetLanguage = 'typescript';
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
const generateJsonSchemaInput = (name, schema) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const schemaInput = new quicktype_core_1.JSONSchemaInput(new quicktype_core_1.JSONSchemaStore());
    yield schemaInput.addSource({ name, schema });
    return schemaInput;
});
const generateJsonInput = (targetLanguage, name, schema) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const jsonInput = quicktype_core_1.jsonInputForTargetLanguage(targetLanguage);
    yield jsonInput.addSource({
        name,
        samples: [schema]
    });
    return jsonInput;
});
//# sourceMappingURL=convertToQuicktype.js.map