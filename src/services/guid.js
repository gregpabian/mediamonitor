export function generate() {
  return Math.ceil(Math.random() * 1e16).toString(16).substr(0, 8);
}
