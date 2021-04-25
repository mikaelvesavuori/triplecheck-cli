import { TripleCheckController } from '../src/controllers/TripleCheckController';
import { config } from '../__testdata__/config';

let Config: any = null;

beforeEach(() => {
  Config = JSON.parse(JSON.stringify(config));
});

describe('Failure cases', () => {
  test('It should throw an error if no argument is provided', () => {
    expect(() => {
      // @ts-ignore
      getContract();
    }).toThrow();
  });
});

describe('Success cases', () => {
  test('It should run the controller when given a valid config', async () => {
    // @ts-ignore
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
    const tripleCheck = await TripleCheckController(Config);
    expect(tripleCheck).toBeTruthy();
    expect(mockExit).toHaveBeenCalledWith(0);
  });
});
