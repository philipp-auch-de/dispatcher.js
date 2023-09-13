console.log('Welcome to dispatcher.js');

export function init() {
  console.log('dispatcher.js is now initializing');
}

export { fine, debug, info, warn, error, errorWithTicket } from './util/logging.js';
