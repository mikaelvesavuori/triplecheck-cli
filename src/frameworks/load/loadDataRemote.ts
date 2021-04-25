import fetch from 'node-fetch';

/**
 * @description Load data from a remote source like object storage (S3...), database (Cloudflare KV...) or just a plain remote file.
 * @todo Get provider data (all versions; to get a single version add a semver pattern like "1" or "1.0.0")
 * SINGLE: const providerContract = fetch(`http://localhost:8080/provider?name=${name}?version=${version}`, { method: "GET" }).then(res => await res.json())
 * ALL: const providerContracts = fetch("http://localhost:8080/provider", { method: "GET" }).then(res => await res.json())
 * @todo Automatically infer how to fetch: Local file: contract.ts || API: https://broker.com/api/consumer || Object storage: https://storage.com/id/file.json
 */
export async function loadDataRemote(url: string, headers?: any): Promise<any> {
  console.log(`Loading data from ${url}...`);
  return await fetch(url, { method: 'GET', headers }).then(async (res) => await res.json());
}
