"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeDatasets = void 0;
function mergeDatasets(localData = [], remoteData = []) {
    if (JSON.stringify(localData) === JSON.stringify(remoteData))
        return localData;
    const arrays = [...localData, ...remoteData];
    const services = {};
    arrays.forEach((item) => {
        if (JSON.stringify(item) === '{}')
            return;
        const serviceName = Object.keys(item)[0];
        if (!services[serviceName]) {
            services[serviceName] = item[serviceName];
            return;
        }
        const version = Object.keys(item[serviceName])[0];
        if (!services[serviceName][version]) {
            services[serviceName][version] = item[serviceName][version];
            return;
        }
        const HAS_TESTS = item[serviceName][version].length > 0 || services[serviceName][version].length > 0;
        if (HAS_TESTS) {
            const tests = item[serviceName][version];
            let updatedTests = [];
            let listOfAddedTestsForCurrentVersion = [];
            services[serviceName][version].forEach((existingTest) => {
                const testName = Object.keys(existingTest)[0];
                listOfAddedTestsForCurrentVersion.push(testName);
            });
            if (tests && tests.length > 0) {
                tests.forEach((test) => {
                    const [testName, testData] = Object.entries(test)[0];
                    const IS_TEST_ALREADY_ADDED = listOfAddedTestsForCurrentVersion.includes(testName);
                    if (IS_TEST_ALREADY_ADDED) {
                        console.log(`ℹ️  Test named "${testName}" will be skipped from the test merge process, as an identically-named test has already been added...`);
                    }
                    else {
                        listOfAddedTestsForCurrentVersion.push(testName);
                        updatedTests.push({
                            [testName]: testData
                        });
                    }
                });
                if (services[serviceName][version] && services[serviceName][version].length > 0)
                    services[serviceName][version].forEach((item) => updatedTests.push(item));
                services[serviceName][version] = updatedTests;
            }
        }
    });
    const serviceList = Object.keys(services).map((itemName) => {
        return { [itemName]: services[itemName] };
    });
    return serviceList;
}
exports.mergeDatasets = mergeDatasets;
//# sourceMappingURL=mergeDatasets.js.map