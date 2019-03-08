// convert a milliseconds into human readable timestamp, e.g. 1:23:45.678
export function toTimestamp(value) {
  const date = new Date(value);
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

  return `${date.getHours()}:${minutes}:${seconds}.${milliseconds}`;
}
