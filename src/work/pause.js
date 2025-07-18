import { sleep } from '../util/generalUtil.js';
import { info, warn } from '../util/logging.js';
import { cancelFeatureRequested } from './workQ.js';

const PAUSE_DURATION_IN_MINUTES = 60;

export async function pauseFeature() {
  info('SLEE', 'Starting to sleep for', PAUSE_DURATION_IN_MINUTES, 'minutes.');
  for (let i = 0; i < PAUSE_DURATION_IN_MINUTES; i++) {
    await sleep(1);
    if (cancelFeatureRequested) {
      warn('SLEE', 'cancelFeatureRequested was found true');
      break;
    }
  }
  info('SLEE', 'Sleep for', PAUSE_DURATION_IN_MINUTES, 'minutes is now over.');
}
