/**
 * @description TODO
 * @todo If empty testScope, test all/self?
 */
export function trimData(data: any, testScope?: string[], excludeScope?: string[]): any {
  let trimmedData = data;

  const localTests =
    trimmedData?.consumerTests?.local && trimmedData.consumerTests.local.length > 0;
  const localContracts =
    trimmedData?.providerContracts?.local && trimmedData.providerContracts.local.length > 0;
  const remoteTests =
    trimmedData?.consumerTests?.remote && trimmedData.consumerTests.remote.length > 0;
  const remoteContracts =
    trimmedData?.providerContracts?.remote && trimmedData.providerContracts.remote.length > 0;

  const trim = (scope: string, exclude?: boolean) => {
    if (localTests)
      trimmedData.consumerTests.local = trimmedData.consumerTests.local.filter((item: any) => {
        if (exclude) return Object.keys(item)[0] !== scope;
        else return Object.keys(item)[0] === scope;
      });

    if (localContracts)
      trimmedData.providerContracts.local = trimmedData.providerContracts.local.filter(
        (item: any) => {
          if (exclude) return Object.keys(item)[0] !== scope;
          else return Object.keys(item)[0] === scope;
        }
      );

    if (remoteTests)
      trimmedData.consumerTests.remote = trimmedData.consumerTests.remote.filter((item: any) => {
        if (exclude) return Object.keys(item)[0] !== scope;
        else return Object.keys(item)[0] === scope;
      });

    if (remoteContracts)
      trimmedData.providerContracts.remote = trimmedData.providerContracts.remote.filter(
        (item: any) => {
          if (exclude) return Object.keys(item)[0] !== scope;
          else return Object.keys(item)[0] === scope;
        }
      );
  };

  if (testScope && testScope.length > 0)
    testScope.forEach((scope: string) => {
      if (scope !== '') trim(scope, false);
    });

  if (excludeScope && excludeScope.length > 0)
    excludeScope.forEach((scope: string) => trim(scope, true));

  return trimmedData;
}
