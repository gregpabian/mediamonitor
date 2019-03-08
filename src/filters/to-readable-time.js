// convert milliseconds into a human readable form, e.g. 1h 23m 45s or 1h 23m 45.678s when showMs set to true
export function toReadableTime(value, showMs) {
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value - hours * 3600) / 60);
  const seconds = showMs
    ? (value - minutes * 60 - hours * 3600).toFixed(3)
    : Math.round(value - minutes * 60 - hours * 3600);

  const hoursString = hours
    ? `${hours}h `
    : '';
  const minutesString = !hours && !minutes
    ? ''
    : `${hours ? String(minutes).padStart(2, '0') : minutes}m `;
  const secondsString = hours || minutes
    ? String(seconds).padStart(showMs ? 6 : 2, '0')
    : seconds;

  return `${hoursString}${minutesString}${secondsString}s`;
}
