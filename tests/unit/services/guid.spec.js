import { generate } from '@/services/guid';

describe('Service - Guid', () => {
  it('should generate 8 character long, random strings', () => {
    // three random values is plenty enough, lol
    const first = generate();
    const second = generate();
    const third = generate();

    expect(first).toHaveLength(8);
    expect(typeof first).toBe('string');

    expect(second).toHaveLength(8);
    expect(typeof second).toBe('string');
    expect(first).not.toBe(second);

    expect(third).toHaveLength(8);
    expect(typeof third).toBe('string');
    expect(first).not.toBe(third);
    expect(second).not.toBe(third);
  });
});
