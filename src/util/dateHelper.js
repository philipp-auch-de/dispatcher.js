import { pad } from './generalUtil.js';
import { error } from './logging.js';

export function dateToIsoString(date) {
  if (typeof date === 'string') date = getDateFromString(date);
  const tzo = -date.getTimezoneOffset();
  const dif = tzo >= 0 ? '+' : '-';

  return date.getFullYear() + '-' + pad(date.getMonth() + 1, 2) + '-' + pad(date.getDate(), 2) + 'T' + pad(date.getHours(), 2) + ':' + pad(date.getMinutes(), 2) + ':' + pad(date.getSeconds(), 2) + dif + pad(Math.floor(Math.abs(tzo) / 60), 2) + ':' + pad(Math.abs(tzo) % 60, 2);
}

export function dateToICALString(date) {
  if (typeof date === 'string') date = getDateFromString(date);
  return date.getFullYear() + pad(date.getMonth() + 1, 2) + pad(date.getDate(), 2) + 'T' + pad(date.getHours(), 2) + pad(date.getMinutes(), 2) + pad(date.getSeconds(), 2);
}

export function dateToJQLString(date) {
  if (typeof date === 'string') date = getDateFromString(date);

  return date.getFullYear() + '-' + pad(date.getMonth() + 1, 2) + '-' + pad(date.getDate(), 2) + ' ' + pad(date.getHours(), 2) + ':' + pad(date.getMinutes(), 2);
}

Date.prototype.addDays = function (days) {
  const date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

Date.prototype.addWeeks = function (weeks) {
  const date = new Date(this.valueOf());
  date.setDate(date.getDate() + weeks * 7);
  return date;
};

Date.prototype.addHours = function (hours) {
  const date = new Date(this.valueOf());
  date.setHours(date.getHours() + hours);
  return date;
};

Date.prototype.addMinutes = function (minutes) {
  const date = new Date(this.valueOf());
  date.setMinutes(date.getMinutes() + minutes);
  return date;
};

Date.prototype.addMonths = function (months) {
  const date = new Date(this.valueOf());
  date.setMonth(date.getMonth() + months);
  return date;
};

Date.prototype.addMS = function (ms) {
  const date = new Date(this.valueOf());
  date.setMilliseconds(date.getMilliseconds() + ms);
  return date;
};

function getDayOfWeekByString(dayString) {
  switch (dayString) {
    case 'SU':
      return 0;
    case 'MO':
      return 1;
    case 'TU':
      return 2;
    case 'WE':
      return 3;
    case 'TH':
      return 4;
    case 'FR':
      return 5;
    case 'SA':
      return 6;
    default:
      error('DATE', 'Unknown date string:', dayString);
  }
}

export function getDateByDayAndSetPos(date, day, setPos, interval) {
  const weekDay = getDayOfWeekByString(day);
  const setPosNumber = Number.parseInt(setPos);
  if (setPosNumber > 0) {
    date.setMonth(date.getMonth() + 1, 1);
    for (let i = date.getDay() % 7 === weekDay ? 1 : 0; i < setPosNumber; i++) {
      date = getNextWeekday(date, weekDay);
    }
  } else {
    date.setMonth(date.getMonth() + 2, 0);
    for (let i = date.getDay() % 7 === weekDay ? 1 : 0; i < setPosNumber * -1; i++) {
      date = getPreviousWeekday(date, weekDay);
    }
  }

  return date;
}

export function getNextWeekday(date, dayOfWeek) {
  date.setDate(date.getDate() + 7 - ((date.getDay() + 7 - dayOfWeek) % 7));
  return date;
}

export function getPreviousWeekday(date, dayOfWeek) {
  return getNextWeekday(date, dayOfWeek).addWeeks(-1);
}

export function getDateFromString(input) {
  let res;
  res = new Date(input);
  if (!isValidDate(res)) {
    while (input.length > 8 && input.length < 15) input += '0';
    res = new Date(input.substring(0, 4) + '-' + input.substring(4, 6) + '-' + input.substring(6, 11) + ':' + input.substring(11, 13) + ':' + input.substring(13, 15));
  }
  if (!isValidDate(res)) {
    error('DAHE', 'Terminating! Invalid Date! Input:', input, 'date', res);
  }
  return res;
}

export function getStringFromDate(date) {
  return '' + (1900 + date.getYear()) + pad(date.getMonth() + 1, 2) + pad(date.getDate(), 2) + 'T' + pad(date.getHours() - 2, 2) + pad(date.getMinutes(), 2) + pad(date.getSeconds(), 2);
}

export function cloneDate(date) {
  const stringDate = dateToIsoString(date);
  return getDateFromString(stringDate);
}

function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

// ****** TEST SETUP ******
export const _testing_date_helper = {};
_testing_date_helper.getDateByDayAndSetPos = getDateByDayAndSetPos;
