"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterData = void 0;
function filterData(data, serviceName, version, test) {
    if (!data)
        throw new Error('Missing data in filterData!');
    return data.filter((service) => {
        if (Object.keys(service)[0] === serviceName) {
            if (!test && !version)
                return;
            else if (!test && version)
                delete service[serviceName][version];
            else if (test && version) {
                const tests = service[serviceName][version];
                if (!tests || tests.length === 0)
                    return;
                const testNames = tests.map((item) => Object.keys(item)[0]);
                const testIndex = testNames.indexOf(test);
                tests.splice(testIndex, 1);
                service[serviceName][version].sort();
            }
            const IS_SERVICE_EMPTY = JSON.stringify(service[Object.keys(service)[0]]) === '{}';
            if (!IS_SERVICE_EMPTY)
                return service;
        }
        return !(Object.keys(service)[0] === serviceName);
    });
}
exports.filterData = filterData;
//# sourceMappingURL=filterData.js.map