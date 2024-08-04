import { warn } from './logging.js';
import versionData from './../../version.json' with { type: 'json' };;

export function getVersion() {
  try {
    return versionData.version;
  } catch (err) {
    warn('DISPATCHER.JS', 'Unable to read version information:', err);
  }
  return 'unknown';
}

export function getVersionDate() {
  try {
    return versionData.built;
  } catch (err) {
    warn('DISPATCHER.JS', 'Unable to read version information:', err);
  }
  return 'unknown';
}
