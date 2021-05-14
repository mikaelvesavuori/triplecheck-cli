import { validateConfig } from '../../src/frameworks/config/validateConfig';

import { config } from '../../__testdata__/config';

describe('Failure cases', () => {
  test('It should throw an error if no argument is provided', () => {
    expect(() => {
      // @ts-ignore
      validateConfig();
    }).toThrow();
  });
});

describe('Success cases', () => {
  test('It should validate a correctly-formatted configuration', () => {
    expect(validateConfig(config)).toBe(true);
  });

  test('It should catch non-standard service names', () => {
    const invalidIdentityName = JSON.parse(JSON.stringify(config));
    invalidIdentityName.identity.name = 'AJ24-provider';
    expect(validateConfig(invalidIdentityName)).toBe(false);
  });

  test('It should catch non-standard service versions with too few SemVer digit blocks (major, minor, patch)', () => {
    const invalidIdentityVersion = JSON.parse(JSON.stringify(config));
    invalidIdentityVersion.identity.version = '123.1.123.123';
    console.log('--->', invalidIdentityVersion);
    expect(validateConfig(invalidIdentityVersion)).toBe(false);
  });

  test('It should catch non-standard service versions that contain characters', () => {
    const invalidIdentityVersionChars = JSON.parse(JSON.stringify(config));
    invalidIdentityVersionChars.identity.version = '1.0.1x';
    console.log('--->', invalidIdentityVersionChars);
    expect(validateConfig(invalidIdentityVersionChars)).toBe(false);
  });

  test('It should give a warning if a configuration is missing contractsPath and testsPath', () => {
    const configNoLocalPaths = JSON.parse(JSON.stringify(config));
    delete configNoLocalPaths.resources.local.contractsPath;
    delete configNoLocalPaths.resources.local.testsPath;
    expect(validateConfig(configNoLocalPaths)).toBe(true);
  });

  test('It should give a warning if a configuration is missing local resources', () => {
    const configNoLocal = JSON.parse(JSON.stringify(config));
    delete configNoLocal.resources.local;
    expect(validateConfig(configNoLocal)).toBe(true);
  });

  test('It should give a warning if a configuration is missing remote resources', () => {
    const configNoRemote = JSON.parse(JSON.stringify(config));
    delete configNoRemote.resources.remote;
    expect(validateConfig(configNoRemote)).toBe(true);
  });
});
