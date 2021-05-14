import { checkIfExists } from '../../src/frameworks/filesystem/checkIfExists';

describe('Failure cases', () => {
  test('It should throw an error if no argument is provided', () => {
    expect(() => {
      // @ts-ignore
      checkIfExists();
    }).toThrow();
  });
});

describe('Success cases', () => {
  test('It should return true if it finds an existing file', () => {
    expect(checkIfExists(`${process.cwd()}/README.md`)).toBe(true);
  });

  test('It should return false if not finding a file', () => {
    expect(checkIfExists(`${process.cwd()}/flh3498yf93hfsoajdyf789y.txt`)).toBe(false);
  });
});
