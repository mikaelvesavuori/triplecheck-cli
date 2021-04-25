/**
 * @description Merge and deduplicate data. Can be used for both tests and contracts.
 * When merging from the broker, local data is synonymous with "current data" and
 * remote data would be "new data".
 */
export function mergeDatasets(localData: any[] = [], remoteData: any[] = []) {
  // If arrays are same, just return right away
  if (JSON.stringify(localData) === JSON.stringify(remoteData)) return localData;

  const arrays = [...localData, ...remoteData];
  const services: any = {}; // Keep as object for easy manipulation below...

  // TODO: Add real type
  arrays.forEach((item: any) => {
    /**
     * Any pre-existing/local/current data will be added at once, so
     * new/updated/remote data will be the only data to get the more
     * extensive test checking beginning at line ~40.
     */
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

    // Check if this item has tests, and also verify if it already exists in services list
    const HAS_TESTS =
      item[serviceName][version].length > 0 || services[serviceName][version].length > 0;

    if (HAS_TESTS) {
      const tests = item[serviceName][version];

      let updatedTests: any[] = [];

      let listOfAddedTestsForCurrentVersion: string[] = [];
      services[serviceName][version].forEach((existingTest: any) => {
        const testName = Object.keys(existingTest)[0];
        listOfAddedTestsForCurrentVersion.push(testName);
      });

      if (tests && tests.length > 0) {
        tests.forEach((test: any) => {
          const [testName, testData] = Object.entries(test)[0];

          const IS_TEST_ALREADY_ADDED = listOfAddedTestsForCurrentVersion.includes(testName);
          if (IS_TEST_ALREADY_ADDED) {
            console.log(
              `ℹ️  Test named "${testName}" will be skipped from the test merge process, as an identically-named test has already been added...`
            );
          } else {
            listOfAddedTestsForCurrentVersion.push(testName);
            updatedTests.push({
              [testName]: testData
            });
          }
        });

        // Add any pre-existing tests to the updated tests array
        if (services[serviceName][version] && services[serviceName][version].length > 0)
          services[serviceName][version].forEach((item: any) => updatedTests.push(item));

        services[serviceName][version] = updatedTests;
      }
    }
  });

  // Convert our object to a proper array
  const serviceList = Object.keys(services).map((itemName: string) => {
    return { [itemName]: services[itemName] };
  });

  return serviceList;
}
