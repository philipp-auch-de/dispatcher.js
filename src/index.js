export function init() {
  console.log('dispatcher.js is now initializing');
}

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
export { config } from './dispatcherJsConfig.js';
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
} from './work/workQ.js';
