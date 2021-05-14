import * as fs from 'fs';

/**
 * @description Check if a file exists.
 */
export function checkIfExists(path: string): boolean {
  if (!path) throw new Error('Missing path in checkIfExists!');
  return fs.existsSync(path);
}
