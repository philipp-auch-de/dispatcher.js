import * as assert from 'assert';
import { _testing_workQ, addEventToList, addFeaturesToQ, getCurrentFeature, getCurrentQ, getPastQ } from '../src/work/workQ.js';
import { Feature } from '../src/work/featureClass.js';

const eventItem = {};

function addDummyEvent() {
  eventItem.name = 'EVENT UNITTEST';
  eventItem.params = 'UNITTEST PARAM';
  eventItem.type = 'EVENT';

  addEventToList(eventItem.name, eventItem.params);
}

const dummyFeature = new Feature('UT-Dummy', toString);

describe('WorkQ tests', () => {
  it('Get empty lists', () => {
    assert.equal(getCurrentQ().length, 0);
    assert.equal(getPastQ().length, 0);
    assert.equal(getCurrentFeature(), null);
  });

  it('Add event and get lists', () => {
    addDummyEvent();
    const currentQ = getCurrentQ();
    assert.equal(currentQ.length, 1);
    assert.equal(currentQ[0].name, eventItem.name);
    assert.equal(currentQ[0].params, eventItem.params);
    assert.equal(currentQ[0].type, eventItem.type);
    assert.equal(getPastQ().length, 0);
    assert.equal(getCurrentFeature(), null);

    _testing_workQ.resetAfterUnitTest();
  });

  it('Add event, feature and get lists', () => {
    addDummyEvent();
    addFeaturesToQ([dummyFeature.clone()]);
    const currentQ = getCurrentQ();

    assert.equal(currentQ[0].name, eventItem.name);
    assert.equal(currentQ[0].params, eventItem.params);
    assert.equal(currentQ[0].type, eventItem.type);

    assert.equal(currentQ[1].name, dummyFeature.name);
    // assert.equal(currentQ[2].name, FEATURES.CLEAR_CACHES.name);

    assert.equal(currentQ.length, 2);

    assert.equal(getPastQ().length, 0);
    assert.equal(getCurrentFeature(), null);

    _testing_workQ.resetAfterUnitTest();
  });

  it('Add event, feature, work on it and get lists', async () => {
    addDummyEvent();
    addFeaturesToQ([dummyFeature.clone()]);

    await _testing_workQ.workOnNextFeature();

    const currentQ = getCurrentQ();
    const pastQ = getPastQ();
    const currentFeature = getCurrentFeature();

    assert.equal(
      currentQ.length,
      0,
      currentQ.map((item) => item.name),
    );
    // assert.notEqual(currentQ[0].name, eventItem.name);
    // assert.notEqual(currentQ[0].params, eventItem.params);
    // assert.notEqual(currentQ[0].type, eventItem.type);
    // assert.equal(currentQ[0].name, FEATURES.CLEAR_CACHES.name);

    assert.equal(
      pastQ.length,
      2,
      pastQ.map((item) => item.name),
    );
    assert.equal(pastQ[0].name, dummyFeature.name);
    assert.equal(pastQ[1].name, eventItem.name);
    assert.equal(pastQ[1].params, eventItem.params);
    assert.equal(pastQ[1].type, eventItem.type);

    assert.equal(currentFeature, null);

    _testing_workQ.resetAfterUnitTest();
  });
});
