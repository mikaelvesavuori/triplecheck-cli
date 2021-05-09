import fetch from 'node-fetch';

/**
 * @description Load data from a remote source like object storage (S3...), database (Cloudflare KV...) or just a plain remote file.
 * @todo Get provider data (all versions; to get a single version add a semver pattern like "1" or "1.0.0")
 * SINGLE: const providerContract = fetch(`http://localhost:8080/provider?name=${name}?version=${version}`, { method: "GET" }).then(res => await res.json())
 * ALL: const providerContracts = fetch("http://localhost:8080/provider", { method: "GET" }).then(res => await res.json())
 * @todo Automatically infer how to fetch: Local file: contract.ts || API: https://broker.com/api/consumer || Object storage: https://storage.com/id/file.json
 */
export async function loadDataRemote(
  type: string,
  url: string,
  include?: string[],
  headers?: any
): Promise<any> {
  console.log(`Loading data from ${url}...`);

  if (include && include.length > 0) {
    const fetchPromises = include.map(async (service: string) => {
      url = 'https://triplecheck-data-service.mikaelvesavuori.workers.dev'; // TODO: Add in config

      return await fetch(`${url}/${type}?${service}`, { method: 'GET', headers }).then(
        async (res) => await res.json()
      );
    });

    const resolved = await Promise.all(fetchPromises);
    let cleaned = resolved.map((item: any) => item[0]);
    cleaned = cleaned.filter((item: any) => item);

    /**
     * Piece the data together as nested objects.
     */
    const final: Record<string, unknown> = {};
    cleaned.forEach((item: any) => {
      if (final[Object.keys(item)[0]])
        final[Object.keys(item)[0]] = Object.assign(
          final[Object.keys(item)[0]],
          Object.values(item)[0]
        );
      else final[Object.keys(item)[0]] = Object.values(item)[0];
    });

    return [final];
  }
}
