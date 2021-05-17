import { Service } from '../../contracts/Service';

import { infoSkippingTestBecauseDuplicate } from '../../frameworks/text/messages';

/**
 * @description Merge and deduplicate data. Can be used for both tests and contracts.
 * When merging from the broker, local data is synonymous with "current data" and
 * remote data would be "new data".
 */
export function mergeDatasets(localData: Service[] = [], remoteData: Service[] = []) {
  // If arrays are same, just return right away
  if (JSON.stringify(localData) === JSON.stringify(remoteData)) return localData;

  const arrays = [...localData, ...remoteData];
  const services: any = {}; // Keep as object for easy manipulation below...

  // One array each: one for local and one for remote
  arrays.forEach((service: Service) => {
    if (JSON.stringify(service) === '{}') return;

    Object.entries(service).forEach((serviceDataArray: any) => {
      const serviceData = serviceDataArray[1];

      /**
       * Any pre-existing/local/current data will be added at once, so
       * new/updated/remote data will be the only data to get the more
       * extensive test checking beginning at line ~40.
       */

      const serviceName = serviceDataArray[0];
      if (!services[serviceName]) {
        services[serviceName] = serviceData;
        return;
      }

      const version = Object.keys(serviceData)[0];
      if (!services[serviceName][version]) {
        services[serviceName][version] = serviceData[version];
        return;
      }

      // Check if this item has tests, and also verify if it already exists in services list
      const HAS_TESTS =
        serviceData[version].length > 0 || services[serviceName][version].length > 0;

      if (HAS_TESTS) {
        const tests = serviceData[version];

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
              console.log(infoSkippingTestBecauseDuplicate(testName));
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
  });

  // Convert our object to a proper array
  return Object.keys(services).map((itemName: string) => {
    return { [itemName]: services[itemName] };
  });
}
