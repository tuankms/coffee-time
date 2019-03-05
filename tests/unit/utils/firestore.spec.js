import { getKeyValue } from '@/utils/firestore';

describe('firestore.spec', () => {
  it('Invokes getKeyValue() with null param', () => {
    const result = getKeyValue(null);
    expect(result).toBe(null);
  });

  it('Invoke getKeyValue() run succesfully - Found key', () => {
    const result = getKeyValue({
      '.key': '123'
    });
    expect(result).toBe('123');
  });

  it('Invoke getKeyValue() run succesfully - Not found key', () => {
    const result = getKeyValue({
      test: '123'
    });
    // get undefined with not found .key
    expect(result).toBe(undefined);
  });
});
