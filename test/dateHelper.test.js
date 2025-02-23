import assert from 'assert';
import {
  _testing_date_helper,
  cloneDate,
  dateToIsoString,
  dateToWeekNumber,
  getDateByDayAndSetPos,
  getNextWeekday,
  getPreviousWeekday,
  getStringFromDate,
  minutesToString,
} from '../src/util/dateHelper.js';

describe('minutesToString Tests', () => {
  it('only minutes', () => {
    assert.equal(minutesToString(42, true), '42 min');
  });
  it('less than minutes', () => {
    assert.equal(minutesToString(42.23, true), '42 min');
  });

  it('only minutes but not shown', () => {
    assert.equal(minutesToString(42, false), '42 min');
  });

  it('only minutes', () => {
    assert.equal(minutesToString(142, true), '2 h 22 min');
  });

  it('only minutes but not shown', () => {
    assert.equal(minutesToString(142, false), '2 h');
  });
});

describe('Date Helper Tests', () => {
  it('add hours positive same day', () => {
    let date = new Date(2022, 9, 1, 15, 10, 24, 8);
    const tz = Math.abs(date.getTimezoneOffset()) / 60;
    assert.equal(dateToIsoString(date), '2022-10-01T15:10:24+0' + tz + ':00');
    date = date.addHours(2);
    assert.equal(dateToIsoString(date), '2022-10-01T17:10:24+0' + tz + ':00');
  });

  it('add hours positive next day', () => {
    let date = new Date(2022, 9, 1, 15, 10, 24, 8);
    const tz = Math.abs(date.getTimezoneOffset()) / 60;
    assert.equal(dateToIsoString(date), '2022-10-01T15:10:24+0' + tz + ':00');
    date = date.addHours(20);
    assert.equal(dateToIsoString(date), '2022-10-02T11:10:24+0' + tz + ':00');
  });

  it('add hours negative same day', () => {
    let date = new Date(2022, 9, 1, 15, 10, 24, 8);
    const tz = Math.abs(date.getTimezoneOffset()) / 60;
    assert.equal(dateToIsoString(date), '2022-10-01T15:10:24+0' + tz + ':00');
    date = date.addHours(-3);
    assert.equal(dateToIsoString(date), '2022-10-01T12:10:24+0' + tz + ':00');
  });

  it('add hours negative next day', () => {
    let date = new Date(2022, 9, 1, 15, 10, 24, 8);
    const tz = Math.abs(date.getTimezoneOffset()) / 60;
    assert.equal(dateToIsoString(date), '2022-10-01T15:10:24+0' + tz + ':00');
    date = date.addHours(-22);
    assert.equal(dateToIsoString(date), '2022-09-30T17:10:24+0' + tz + ':00');
  });

  it('get next weekday', () => {
    let date = new Date(2022, 9, 1, 15, 10, 24, 8);
    const tz = Math.abs(date.getTimezoneOffset()) / 60;
    assert.equal(dateToIsoString(date), '2022-10-01T15:10:24+0' + tz + ':00'); // Sat
    date = getNextWeekday(date, 1); // Monday
    assert.equal(dateToIsoString(date), '2022-10-03T15:10:24+0' + tz + ':00'); // Mon
  });

  it('get next weekday on same day', () => {
    let date = new Date(2022, 9, 3, 15, 10, 24, 8);
    const tz = Math.abs(date.getTimezoneOffset()) / 60;
    assert.equal(dateToIsoString(date), '2022-10-03T15:10:24+0' + tz + ':00'); // Mon
    date = getNextWeekday(date, 1); // Monday
    assert.equal(dateToIsoString(date), '2022-10-10T15:10:24+0' + tz + ':00'); // Mon
  });

  it('get previous weekday', () => {
    let date = new Date(2022, 9, 1, 15, 10, 24, 8);
    const tz = Math.abs(date.getTimezoneOffset()) / 60;
    assert.equal(dateToIsoString(date), '2022-10-01T15:10:24+0' + tz + ':00'); // Sat
    date = getPreviousWeekday(date, 1); // Monday
    assert.equal(dateToIsoString(date), '2022-09-26T15:10:24+0' + tz + ':00'); // Mon
  });

  it('clone date', () => {
    let date = new Date(2022, 9, 1, 15, 10, 24, 8);
    const tz = Math.abs(date.getTimezoneOffset()) / 60;
    assert.equal(dateToIsoString(date), '2022-10-01T15:10:24+0' + tz + ':00');
    date = cloneDate(date);
    assert.equal(dateToIsoString(date), '2022-10-01T15:10:24+0' + tz + ':00');
  });

  it('get string from date', () => {
    let date = new Date(2022, 9, 1, 15, 10, 24, 8);
    assert.equal(getStringFromDate(date), '20221001T151024');
  });

  [
    {
      date: new Date(2022, 8, 1, 15, 10, 24, 8),
      day: 'SA',
      setPos: '1',
      expected: '2022-10-01',
    },
    {
      date: new Date(2022, 8, 1, 15, 10, 24, 8),
      day: 'SU',
      setPos: '1',
      expected: '2022-10-02',
    },
    {
      date: new Date(2022, 8, 1, 15, 10, 24, 8),
      day: 'SA',
      setPos: '2',
      expected: '2022-10-08',
    },
    {
      date: new Date(2022, 8, 1, 15, 10, 24, 8),
      day: 'SA',
      setPos: '3',
      expected: '2022-10-15',
    },
    {
      date: new Date(2022, 8, 1, 15, 10, 24, 8),
      day: 'SA',
      setPos: '-1',
      expected: '2022-10-29',
    },
  ].forEach(({ date, day, setPos, expected }) => {
    it(`try translating \'${getStringFromDate(date)}\' \'${day}\' \'${setPos}\'`, function () {
      const tz = Math.abs(date.getTimezoneOffset()) / 60;
      date = getDateByDayAndSetPos(date, day, setPos);
      assert.equal(dateToIsoString(date), expected + 'T15:10:24+0' + tz + ':00');
    });
  });

  [
    {
      date: new Date(2024, 6, 1),
      expected: 27,
    },
    {
      date: new Date(2024, 6, 7),
      expected: 27,
    },
    {
      date: new Date(2024, 6, 8),
      expected: 28,
    },
  ].forEach(({ date, expected }) => {
    it(`getting week number for \'${getStringFromDate(date)}\'`, function () {
      assert.equal(dateToWeekNumber(date), expected);
    });
  });
});
