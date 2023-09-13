export function pad(num, size) {
  num = num.toString();
  while (num.length < size) num = '0' + num;
  return num;
}

export async function sleep(mins) {
  return new Promise((resolve) => setTimeout(resolve, mins * 60 * 1000));
}

export function waitSyncMS(ms) {
  const start = Date.now();
  let now = start;
  while (now - start < ms) {
    now = Date.now();
  }
}

Object.byString = function (o, s) {
  s = s.replace(/\[(\w+)]/g, '.$1'); // convert indexes to properties
  s = s.replace(/^\./, ''); // strip a leading dot
  const a = s.split('.');
  for (let i = 0, n = a.length; i < n; ++i) {
    const k = a[i];
    if (k in o) {
      o = o[k];
    } else {
      return undefined;
    }
  }
  return o;
};
