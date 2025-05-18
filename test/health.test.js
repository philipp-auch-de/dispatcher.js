import * as assert from 'assert';
import { featureError, featureSuccess, getHealth } from '../src/work/health.js';

describe('Health tests', () => {
  it('no error', () => {
    const resp = getHealth();
    assert.equal(resp.health, 'ok');
    assert.equal(resp.error, undefined);
  });

  it('featureError', () => {
    featureError('featureName', 'message');
    const resp = getHealth();
    assert.equal(resp.health, 'error');
    assert.equal(resp.error.feature, 'featureName');
    assert.equal(resp.error.message, 'message');
    assert.notEqual(resp.error.date, undefined);
  });

  it('cleared featureError', () => {
    featureError('featureName', 'message');
    const resp = getHealth();
    assert.equal(resp.health, 'error');
    assert.equal(resp.error.feature, 'featureName');
    assert.equal(resp.error.message, 'message');
    assert.notEqual(resp.error.date, undefined);

    featureSuccess('featureName');

    const resp2 = getHealth();
    assert.equal(resp2.health, 'ok');
    assert.equal(resp2.error, undefined);
  });
});
