import { createNewTripleCheck } from '../src/entities/TripleCheck';
import { config } from '../__testdata__/config';

let tripleCheck: any = null;

describe('Failure cases', () => {
  beforeEach(async () => {
    const failingConfig = JSON.parse(JSON.stringify(config));
    failingConfig.resources.local.testsPath = '__testdata__/tests.fail.json';
    tripleCheck = await createNewTripleCheck(failingConfig);
  });

  test('It should throw an error if no argument is provided', () => {
    expect(() => {
      // @ts-ignore
      tripleCheck();
    }).toThrow();
  });

  describe('It should give correct exit codes for tests', () => {
    test('It should shut down the process if a test fails', async () => {
      // @ts-ignore
      const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
      await tripleCheck.test();
      expect(mockExit).toHaveBeenCalledTimes(1);
      mockExit.mockRestore();
    });
  });
});

describe('Success cases', () => {
  beforeEach(async () => {
    const passingConfig = JSON.parse(JSON.stringify(config));
    tripleCheck = await createNewTripleCheck(passingConfig);
  });

  describe('It should give correct exit codes for tests', () => {
    // @see https://stackoverflow.com/questions/46148169/stubbing-process-exit-with-jest
    test('It should exit successfully if all tests pass', async () => {
      // @ts-ignore
      const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
      await tripleCheck.test();
      expect(mockExit).not.toHaveBeenCalled();
      mockExit.mockRestore();
    });
  });

  describe('It should publish', () => {
    test('It should publish when given a valid configuration', async () => {
      // @ts-ignore
      const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
      await tripleCheck.publish();
      expect(mockExit).toHaveBeenCalledWith(0);
      mockExit.mockRestore();
    });
  });
});
