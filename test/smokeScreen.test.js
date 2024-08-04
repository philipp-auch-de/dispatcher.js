import * as assert from 'assert';
import { init } from '../src/index.js';

describe('Smoke Screen', () => {
  it('Test startup', () => {
    assert.equal('s', 's');
  });

  function dummy() {}

  it('Test init', () => {
    init(dummy);
    assert.equal('s', 's');
  });
});
