import { dispatcherJsConfig } from './dispatcherJsConfig.js';
import { error, info } from './util/logging.js';
import { getVersion, getVersionDate } from './util/version.js';
export { fine, debug, info, warn, error, errorWithTicket, TicketError } from './util/logging.js';
export { SPACE, QUOTATION, HASHTAG, AMPERSAND, APOSTROPHE, BRACKET_OPEN, BRACKET_CLOSE, SMALLER, EQUALS, TILDE, AE } from './util/HTMLHelper.js';
export { sleep, pad, waitSyncMS } from './util/generalUtil.js';
export {
  dateToIsoString,
  dateToICALString,
  dateToJQLString,
  getDateByDayAndSetPos,
  getNextWeekday,
  getPreviousWeekday,
  getDateFromString,
  getStringFromDate,
  cloneDate,
  dateToWeekNumber,
} from './util/dateHelper.js';
export { dispatcherJsConfig } from './dispatcherJsConfig.js';
export { _callUrl } from './util/httpHelper.js';
export { Feature, FEATURE_STATUS } from './work/featureClass.js';
export {
  addFeaturesToQ,
  terminate,
  resetQ,
  addEventToList,
  getCurrentQ,
  getPastQ,
  getCurrentFeature,
  startWorking,
  setCurrentlyWorkingOn,
  currentlyWorkingOn,
  cancelFeatureRequested,
  setFeatureResult,
  addToFeatureResult,
} from './work/workQ.js';

export function init(handlers, allFeatureSet) {
  info('DISPATCHER.JS', 'Now initializing');
  info('DISPATCHER.JS', 'Currently running with', getVersion(), 'released on', getVersionDate());
  if (!handlers.errorHandler) {
    error('DISPATCHER.JS', 'No errorHandlerFunction was provided which is needed for dispatcher.js to start. Application will now exit');
    process.exit(1);
  }
  if (!handlers.emptyQHandler) {
    handlers.emptyQHandler = doNothing;
  }
  dispatcherJsConfig.handlers = handlers;
  dispatcherJsConfig.allFeatureSet = allFeatureSet;
}

async function doNothing() {
  // intentionally empty
}
