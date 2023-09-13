export function init() {
  console.log('dispatcher.js is now initializing');
}

export { fine, debug, info, warn, error, errorWithTicket } from './util/logging.js';
export { AE, AMPERSAND, APOSTROPHE, EQUALS, HASHTAG, QUOTATION, SPACE, TILDE } from './util/JQLHelper.js';
