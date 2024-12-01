import { dispatcherJsConfig } from '../dispatcherJsConfig.js';
import { sleep, waitSyncMS } from '../util/generalUtil.js';
import { debug, fine, info, TicketError, warn } from '../util/logging.js';
import { FEATURE_STATUS } from './featureClass.js';

let Q = [];
let pastQ = [];
let eventList = [];
let currentFeature = null;
let eventCutoffDate = new Date().setHours(new Date().getHours() - 1);
let terminating = false;
export let currentlyWorkingOn = '';
export let cancelFeatureRequested = false;

export function addFeaturesToQ(featureSet) {
  featureSet = featureSet.filter((item) => item && item.status === FEATURE_STATUS.ACTIVE);
  const expandedFeatureSet = [];
  featureSet.map((item) => expandedFeatureSet.push(...item.getPrerequisitesAndFeature()));
  // expandedFeatureSet.push(FEATURES.CLEAR_CACHES.clone());
  if (Q.length > 50) {
    warn(
      'WORK',
      'Q was full. Max amount is 50. Did not add:',
      expandedFeatureSet.map((item) => item.name),
    );
    // if (Q[Q.length - 1].name !== 'CLEAR_CACHES') {
    // Q.push(FEATURES.CLEAR_CACHES.clone());
    // waitSyncMS(1);
    // }
  } else {
    info(
      'WORK',
      'Adding features to Q',
      expandedFeatureSet.map((item) => item.name),
    );
    for (const item of expandedFeatureSet) {
      item.timeAdded = new Date();
      waitSyncMS(1);
    }
    Q.push(...expandedFeatureSet);
  }
}

async function workOnNextFeature() {
  currentFeature = Q.shift();
  currentFeature.startDate = new Date();
  currentFeature.errorForFeature = null;
  currentFeature.getDurationString = function () {
    const runInSeconds = Math.abs(new Date().getTime() - this.startDate.getTime()) / 1000;
    return Math.floor(runInSeconds / 60) + 'm ' + Math.floor(runInSeconds % 60) + 's';
  };
  eventCutoffDate = currentFeature.timeAdded;
  info('WORK', 'Now working on feature', currentFeature.name, 'with params', currentFeature.params);
  if (currentFeature.status === FEATURE_STATUS.ACTIVE) {
    try {
      currentlyWorkingOn = '';
      cancelFeatureRequested = false;
      await currentFeature.entry();
      if (Q.length == 0) await dispatcherJsConfig.handlers.emptyQHandler();
    } catch (e) {
      try {
        if (e instanceof TicketError) {
          await dispatcherJsConfig.handlers.errorHandler(e.ticket, e.message, e.stack);
        } else {
          await dispatcherJsConfig.handlers.errorHandler('PAUC-5', e.message?.length > 0 ? e.message : e, e.stack);
        }
      } catch (e2) {
        warn('WORK', 'Unable to send mail:', e2);
      }
      addErrorToCurrentFeature(e);
      console.log(e.stack);
      await resetQ();
      info('WORK', 'Clearing cache after error');
    }
    // printStatistics();
  } else {
    info('WORK', 'Feature is disabled.');
  }
  if (currentFeature.errorForFeature) warn('WORK', 'Feature errors:', currentFeature.errorForFeature);
  const runInSeconds = Math.abs(new Date().getTime() - currentFeature.startDate.getTime()) / 1000;
  const durationString = Math.floor(runInSeconds / 60) + 'm ' + Math.floor(runInSeconds % 60) + 's';
  info('WORK', 'run duration:', durationString);
  currentFeature.durationString = durationString;
  pastQ.unshift(currentFeature);
  currentFeature = null;
  waitSyncMS(1);
}

function addErrorToCurrentFeature(error) {
  if (!currentFeature.errorForFeature) currentFeature.errorForFeature = [];
  currentFeature.errorForFeature.push(error);
}

export function terminate() {
  info('WORK', 'TERMINATE INITIATED!');
  Q = [];
  terminating = true;
  cancelFeatureRequested = true;
}

export async function resetQ() {
  info('WORK', 'Reset Q!');
  cancelFeatureRequested = true;
  Q = [];
  addFeaturesToQ([]);
  await dispatcherJsConfig.handlers.emptyQHandler();
}

export function addEventToList(name, params) {
  debug('WORK', 'Adding event to EventList', name, 'PARAMS', params);
  const eventItem = {};
  if (name.indexOf('EVENT') === -1) {
    eventItem.name = 'EVENT ' + name;
  } else {
    eventItem.name = name;
  }
  eventItem.params = params;
  eventItem.timeAdded = new Date();
  eventItem.startDate = eventItem.timeAdded;
  eventItem.type = 'EVENT';
  eventList.push(eventItem);
  waitSyncMS(1);
}

export function getCurrentQ() {
  let returnQ = [];
  returnQ = returnQ.concat(eventList.filter((item) => item.timeAdded > eventCutoffDate));
  returnQ = returnQ.concat(Q);
  returnQ = returnQ.sort((a, b) => a.timeAdded - b.timeAdded);
  return returnQ;
}

export function getPastQ() {
  let returnQ = [];
  returnQ = returnQ.concat(eventList.filter((item) => item.timeAdded <= eventCutoffDate));
  returnQ = returnQ.concat(pastQ);
  returnQ = returnQ.sort((a, b) => b.timeAdded - a.timeAdded);
  return returnQ.slice(0, 200);
}

export function getCurrentFeature() {
  return currentFeature;
}

export async function startWorking() {
  while (!terminating) {
    if (Q.length === 0) {
      await sleep(0.1);
    } else {
      await workOnNextFeature();
      info(
        'WORK',
        'Q',
        Q.map((item) => item.name),
      );
    }
  }
}

export function setCurrentlyWorkingOn(text) {
  currentlyWorkingOn = text;
}

export function addToFeatureResult(text) {
  if (!text || text.length <= 0) {
    return;
  }

  if (currentFeature.result && currentFeature.result.length > 0) {
    currentFeature.result += '<br>' + text;
  } else {
    currentFeature.result = text;
  }
  fine('WORK', 'Setting result to:', currentFeature.result);
}

export function setFeatureResult(text) {
  currentFeature.result = text;
}

// ****** TEST SETUP ******
export const _testing_workQ = {};
_testing_workQ.resetAfterUnitTest = resetAfterUnitTest;
_testing_workQ.workOnNextFeature = workOnNextFeature;

function resetAfterUnitTest() {
  Q = [];
  eventList = [];
  pastQ = [];
  currentFeature = null;
  eventCutoffDate = new Date().setHours(new Date().getHours() - 1);
}
