import * as fs from 'fs';

import { write } from '../../src/frameworks/filesystem/write';

describe('Failure cases', () => {
  test('It should throw an error if no argument is provided', () => {
    expect(() => {
      // @ts-ignore
      write();
    }).toThrow();
  });
});

describe('Success cases', () => {
  test('It should write a file to disk', () => {
    const content = `testing here`;
    const path = `${process.cwd()}/__testing-write__.txt`;
    write(path, content);
    const exists = fs.existsSync(path);
    fs.unlinkSync(path);

    expect(exists).toBe(true);
  });
});
