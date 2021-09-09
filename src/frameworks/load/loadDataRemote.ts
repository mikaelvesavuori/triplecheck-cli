// @ts-ignore
import fetch from 'node-fetch';

import { msgLoadingRemote } from '../../frameworks/text/messages';

/**
 * @description Load data from a remote source.
 */
export async function loadDataRemote(
  type: string,
  url: string,
  include?: string[],
  headers?: any
): Promise<any> {
  console.log(msgLoadingRemote(url));

  if (include && include.length > 0) {
    const fetchPromises = include.map(async (service: string) => {
      return fetch(`${url}/${type}?${service}`, { method: 'GET', headers }).then(async (res: any) =>
        res.json()
      );
    });

    const resolved = await Promise.all(fetchPromises);

    // A bit of an odd use-case but when dependents are needed the data required back is just a single array with no further transformations
    if (type === 'dependents') return resolved[0];

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
