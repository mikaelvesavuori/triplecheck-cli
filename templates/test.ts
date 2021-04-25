import { something } from '../somewhere';

describe('Failure cases', () => {
  test('It should throw an error if no argument is provided', () => {
    expect(() => {
      // @ts-ignore
      something();
    }).toThrow();
  });
});

describe('Success cases', () => {
  test('It should asdf', () => {
    expect(something()).toMatchObject({
      name: 'asdf'
    });
  });
});
