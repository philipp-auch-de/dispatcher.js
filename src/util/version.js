import fs from 'node:fs';
import { warn } from './logging.js';

export function getVersion() {
  try {
    const data = fs.readFileSync('./version.json', 'utf8');
    return JSON.parse(data).version;
  } catch (err) {
    warn('DISPATCHER.JS', 'Unable to read version information:', err);
  }
  return 'unknown';
}

export function getVersionDate() {
  try {
    const data = fs.readFileSync('./version.json', 'utf8');
    return JSON.parse(data).built;
  } catch (err) {
    warn('DISPATCHER.JS', 'Unable to read version information:', err);
  }
  return 'unknown';
}
