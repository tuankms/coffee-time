import { uniqueArray, isEmpty } from '@/utils/collection';

describe('collection.spec', () => {
  it('Invokes isEmpty() with an empty array', () => {
    const arr = [];

    const actualResult = isEmpty(arr);

    expect(actualResult).toBe(true);
  });

  it('Invokes isEmpty() with a not empty array', () => {
    const arr = [1, 2];

    const actualResult = isEmpty(arr);

    expect(actualResult).toBe(false);
  });

  it('Invokes isEmpty() with a non-array object', () => {
    const nonArr = {};

    const actualResult = isEmpty(nonArr);

    expect(actualResult).toBe(true);
  });

  it('Invokes isEmpty() with a null', () => {
    const nonArr = null;

    const actualResult = isEmpty(nonArr);

    expect(actualResult).toBe(true);
  });

  it('Invokes uniqueArray() with a duplicated array', () => {
    const duplicatedArray = [1, 1, 2, 2, 3, 4];

    const actualResult = uniqueArray(duplicatedArray);
    const expectedResult = [1, 2, 3, 4];

    expect(expectedResult).toEqual(expect.arrayContaining(actualResult));
  });

  it('Invokes uniqueArray() with a non-array object', () => {
    const duplicatedArray = {};

    const actualResult = uniqueArray(duplicatedArray);
    const expectedResult = [];

    expect(expectedResult).toEqual(expect.arrayContaining(actualResult));
  });

  it('Invokes uniqueArray() with a null', () => {
    const duplicatedArray = null;

    const actualResult = uniqueArray(duplicatedArray);
    const expectedResult = [];

    expect(expectedResult).toEqual(expect.arrayContaining(actualResult));
  });
});
