"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trimData = void 0;
function trimData(data, testScope, excludeScope) {
    var _a, _b, _c, _d;
    let trimmedData = data;
    const localTests = ((_a = trimmedData === null || trimmedData === void 0 ? void 0 : trimmedData.consumerTests) === null || _a === void 0 ? void 0 : _a.local) && trimmedData.consumerTests.local.length > 0;
    const localContracts = ((_b = trimmedData === null || trimmedData === void 0 ? void 0 : trimmedData.providerContracts) === null || _b === void 0 ? void 0 : _b.local) && trimmedData.providerContracts.local.length > 0;
    const remoteTests = ((_c = trimmedData === null || trimmedData === void 0 ? void 0 : trimmedData.consumerTests) === null || _c === void 0 ? void 0 : _c.remote) && trimmedData.consumerTests.remote.length > 0;
    const remoteContracts = ((_d = trimmedData === null || trimmedData === void 0 ? void 0 : trimmedData.providerContracts) === null || _d === void 0 ? void 0 : _d.remote) && trimmedData.providerContracts.remote.length > 0;
    const trim = (scope, exclude) => {
        if (localTests)
            trimmedData.consumerTests.local = trimmedData.consumerTests.local.filter((item) => {
                if (exclude)
                    return Object.keys(item)[0] !== scope;
                else
                    return Object.keys(item)[0] === scope;
            });
        if (localContracts)
            trimmedData.providerContracts.local = trimmedData.providerContracts.local.filter((item) => {
                if (exclude)
                    return Object.keys(item)[0] !== scope;
                else
                    return Object.keys(item)[0] === scope;
            });
        if (remoteTests)
            trimmedData.consumerTests.remote = trimmedData.consumerTests.remote.filter((item) => {
                if (exclude)
                    return Object.keys(item)[0] !== scope;
                else
                    return Object.keys(item)[0] === scope;
            });
        if (remoteContracts)
            trimmedData.providerContracts.remote = trimmedData.providerContracts.remote.filter((item) => {
                if (exclude)
                    return Object.keys(item)[0] !== scope;
                else
                    return Object.keys(item)[0] === scope;
            });
    };
    if (testScope && testScope.length > 0)
        testScope.forEach((scope) => {
            if (scope !== '')
                trim(scope, false);
        });
    if (excludeScope && excludeScope.length > 0)
        excludeScope.forEach((scope) => trim(scope, true));
    return trimmedData;
}
exports.trimData = trimData;
//# sourceMappingURL=trimData.js.map