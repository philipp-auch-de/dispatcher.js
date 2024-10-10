// import { config } from '../src/config.js';
import { init } from '../src/index.js';
import { info } from '../src/index.js';

export function mochaGlobalSetup() {
  info('MOCHA', 'Logging reduced for Unittests');
}

function dummy() {}

export const mochaHooks = {
  beforeEach(done) {
    init({ errorHandler: dummy });
    // config.DEBUG_MODE      = 0;
    // config.DEBUG_GET_CALLS = 1;
    // config.FINE_MODE       = 0;
    // config.IS_UNIT_TEST    = true;
    done();
  },
};
