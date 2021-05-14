import { createNewTripleCheck } from '../src/entities/TripleCheck';
import { config } from '../__testdata__/config';

let tripleCheck: any = null;
let Config: any = null;

beforeEach(async () => {
  Config = JSON.parse(JSON.stringify(config));
  // @ts-ignore
  tripleCheck = await createNewTripleCheck(config);
});

describe('Failure cases', () => {
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
      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });
});

describe('Success cases', () => {
  describe('It should give correct exit codes for tests', () => {
    // @see https://stackoverflow.com/questions/46148169/stubbing-process-exit-with-jest
    test('It should exit successfully if all tests pass', async () => {
      let _config: any = Config;
      // @ts-ignore
      config.tests.excludeScope = ['asdf-provider'];
      tripleCheck = await createNewTripleCheck(_config);

      // @ts-ignore
      const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
      await tripleCheck.test();
      expect(mockExit).toHaveBeenCalledWith(0);
    });
  });

  describe('It should publish', () => {
    test('It should publish when given a valid configuration', async () => {
      // @ts-ignore
      const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
      await tripleCheck.publish();
      expect(mockExit).toHaveBeenCalledWith(0);
    });
  });
});
