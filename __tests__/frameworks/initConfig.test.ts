import * as fs from 'fs';

import { initConfig } from '../../src/frameworks/config/initConfig';
import baseConfig from '../../src/frameworks/config/baseConfig.json';

describe('Failure cases', () => {
  test('It should throw an error if no argument is provided', () => {
    expect(() => {
      // @ts-ignore
      initConfig();
    }).toThrow();
  });
});

describe('Success cases', () => {
  test('It should write a config to disk if no file exists at the given path', () => {
    const configPath = `${process.cwd()}/__testing-write-config__.json`;
    initConfig(baseConfig, configPath);
    const exists = fs.existsSync(configPath);
    fs.unlinkSync(configPath);
    expect(exists).toBe(true);
  });

  test('It should skip writing a config to disk if there is already a file at the given path', () => {
    const configPath = `${process.cwd()}/README.md`;
    const result = initConfig(baseConfig, configPath);
    expect(result).toBe(false);
  });
});
