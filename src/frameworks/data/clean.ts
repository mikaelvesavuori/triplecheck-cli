/**
 * @description Process and return a clean array of services according to the incoming include list.
 * We dedupe and clean data in the broker, so this function is only practically meaningful for local data.
 * Incoming data can be tests or contracts.
 */
export function clean(data: any[], include: string[]) {
  let included: string[] = [];
  const cleanedData: any = {};

  include.forEach((includeService: any) => {
    const obj: any = {};
    data.forEach((item: any) => {
      const service: any = Object.keys(item)[0];

      if (service === includeService.split('@')[0]) {
        const versions: any = Object.keys(item[service]);

        versions.forEach((version: string) => {
          const currentServiceVersion = `${service}@${version}`;
          if (
            includeService === currentServiceVersion &&
            !included.includes(currentServiceVersion)
          ) {
            if (!cleanedData[service]) cleanedData[service] = {};
            cleanedData[service][version] = item[service][version];
            included.push(currentServiceVersion);
          }
        });
      }
    });
  });

  return [cleanedData];
}
