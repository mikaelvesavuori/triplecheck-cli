"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripleCheckController = void 0;
const tslib_1 = require("tslib");
const TripleCheck_1 = require("../entities/TripleCheck");
function TripleCheckController(config) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const tripleCheck = yield TripleCheck_1.createNewTripleCheck(config);
        const { skipTestingLocalResources, skipTestingRemoteResources } = tripleCheck.config.tests;
        if (!(skipTestingLocalResources && skipTestingRemoteResources))
            yield tripleCheck.test();
        if (process.env.NODE_ENV === 'test')
            return tripleCheck;
    });
}
exports.TripleCheckController = TripleCheckController;
//# sourceMappingURL=TripleCheckController.js.map