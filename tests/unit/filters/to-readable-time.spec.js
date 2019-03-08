import { toReadableTime } from '@/filters/to-readable-time';

describe('Filter - toReadableTime', () => {
  it('should produce a readable time for the given timestamps', () => {
    expect(toReadableTime(0)).toBe('0s');
    expect(toReadableTime(1.234)).toBe('1s');
    expect(toReadableTime(123.456)).toBe('2m 03s');
    expect(toReadableTime(173.456)).toBe('2m 53s');
    expect(toReadableTime(1234.567)).toBe('20m 35s');
    expect(toReadableTime(12345.678)).toBe('3h 25m 46s');
  });

  it('should include milliseconds when showMs is set to true', () => {
    expect(toReadableTime(0, true)).toBe('0.000s');
    expect(toReadableTime(0.123, true)).toBe('0.123s');
    expect(toReadableTime(1.234, true)).toBe('1.234s');
    expect(toReadableTime(123.456, true)).toBe('2m 03.456s');
    expect(toReadableTime(1234.567, true)).toBe('20m 34.567s');
    expect(toReadableTime(12345.678, true)).toBe('3h 25m 45.678s');
  });
});
