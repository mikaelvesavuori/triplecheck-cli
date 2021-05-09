"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trimData = void 0;
function trimData(data, include) {
    var _a, _b, _c, _d;
    let trimmedData = data;
    const localTests = ((_a = trimmedData === null || trimmedData === void 0 ? void 0 : trimmedData.consumerTests) === null || _a === void 0 ? void 0 : _a.local) && trimmedData.consumerTests.local.length > 0;
    const localContracts = ((_b = trimmedData === null || trimmedData === void 0 ? void 0 : trimmedData.providerContracts) === null || _b === void 0 ? void 0 : _b.local) && trimmedData.providerContracts.local.length > 0;
    const remoteTests = ((_c = trimmedData === null || trimmedData === void 0 ? void 0 : trimmedData.consumerTests) === null || _c === void 0 ? void 0 : _c.remote) && trimmedData.consumerTests.remote.length > 0;
    const remoteContracts = ((_d = trimmedData === null || trimmedData === void 0 ? void 0 : trimmedData.providerContracts) === null || _d === void 0 ? void 0 : _d.remote) && trimmedData.providerContracts.remote.length > 0;
    const trimmer = (scope) => {
        if (localTests)
            trimmedData.consumerTests.local = trimmedData.consumerTests.local.filter((item) => trim(item, scope));
        if (localContracts)
            trimmedData.providerContracts.local = trimmedData.providerContracts.local.filter((item) => trim(item, scope));
        if (remoteTests)
            trimmedData.consumerTests.remote = trimmedData.consumerTests.remote.filter((item) => trim(item, scope));
        if (remoteContracts)
            trimmedData.providerContracts.remote = trimmedData.providerContracts.remote.filter((item) => trim(item, scope));
    };
    if (include && include.length > 0)
        include.forEach((scope) => {
            if (scope !== '')
                trimmer(scope);
        });
    if (3 > 5)
        console.log('include', include);
    return trimmedData;
}
exports.trimData = trimData;
const trim = (item, scope) => {
    const name = Object.keys(item)[0];
    const [scopeName, scopeVersion] = scope.split('@');
    if (scopeName === name) {
    }
};
//# sourceMappingURL=trimData.js.map