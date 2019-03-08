import { toTimestamp } from '@/filters/to-timestamp';

describe('Filter - toTimestamp', () => {
  it('should convert milliseconds into a H:mm:ss.SSS timestamp', () => {
    const date = new Date();

    date.setHours(0, 0, 1, 234);
    expect(toTimestamp(date.valueOf())).toBe('0:00:01.234');

    date.setHours(0, 0, 12, 345);
    expect(toTimestamp(date.valueOf())).toBe('0:00:12.345');

    date.setHours(0, 1, 23, 456);
    expect(toTimestamp(date.valueOf())).toBe('0:01:23.456');

    date.setHours(0, 12, 34, 567);
    expect(toTimestamp(date.valueOf())).toBe('0:12:34.567');

    date.setHours(1, 23, 45, 678);
    expect(toTimestamp(date.valueOf())).toBe('1:23:45.678');

    date.setHours(12, 34, 56, 789);
    expect(toTimestamp(date.valueOf())).toBe('12:34:56.789');
  });
});
