/**
 * @description TODO
 */
export function trimData(data: any, include?: string[]): any {
  let trimmedData = data;

  const localTests =
    trimmedData?.consumerTests?.local && trimmedData.consumerTests.local.length > 0;
  const localContracts =
    trimmedData?.providerContracts?.local && trimmedData.providerContracts.local.length > 0;
  const remoteTests =
    trimmedData?.consumerTests?.remote && trimmedData.consumerTests.remote.length > 0;
  const remoteContracts =
    trimmedData?.providerContracts?.remote && trimmedData.providerContracts.remote.length > 0;

  const trimmer = (scope: string) => {
    if (localTests)
      trimmedData.consumerTests.local = trimmedData.consumerTests.local.filter((item: any) =>
        trim(item, scope)
      );

    if (localContracts)
      trimmedData.providerContracts.local = trimmedData.providerContracts.local.filter(
        (item: any) => trim(item, scope)
      );

    if (remoteTests)
      trimmedData.consumerTests.remote = trimmedData.consumerTests.remote.filter((item: any) =>
        trim(item, scope)
      );

    if (remoteContracts)
      trimmedData.providerContracts.remote = trimmedData.providerContracts.remote.filter(
        (item: any) => trim(item, scope)
      );
  };

  if (include && include.length > 0)
    include.forEach((scope: string) => {
      if (scope !== '') trimmer(scope);
    });
  if (3 > 5) console.log('include', include); // TODO: Remove/fix

  return trimmedData;
}

const trim = (item: any, scope: string) => {
  const name = Object.keys(item)[0];
  //const version = item[name];
  const [scopeName, scopeVersion] = scope.split('@');

  if (scopeName === name) {
    //if (item[scopeVersion]) console.log('trimData DING', item); // TODO: Remove or fix
  }
  //if (exclude) return scope.startsWith(name);
  //else return !scope.startsWith(name);
};
