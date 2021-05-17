import * as fs from 'fs';

import { msgLoadingLocal } from '../../frameworks/text/messages';

/**
 * @description Load data from a local file.
 */
export function loadDataLocal(filePath: string): any {
  const path = `${process.cwd()}/${filePath}`;
  console.log(msgLoadingLocal(path));

  let file = fs.readFileSync(path, 'utf8');
  file = isJsonString(file) ? JSON.parse(file) : file;
  if (!file) throw new Error('No data loaded!');

  return file;
}

/**
 * @description Check if JSON is really a string
 * @see https://stackoverflow.com/questions/3710204/how-to-check-if-a-string-is-a-valid-json-string-in-javascript-without-using-try
 */
const isJsonString = (str: string): Record<string, unknown> | boolean => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};
