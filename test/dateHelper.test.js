import assert from 'assert';
import { _testing_date_helper } from '../src/util/dateHelper.js';

describe('Calendar tests', function () {
  this.timeout(5000);
  this.slow(50);

  describe('parse rrules', function () {
    const tests = [
      {
        name: 'every month on the second friday',
        oldDate: new Date(2024, 0, 5, 13, 42),
        newDate: new Date(2024, 1, 9, 13, 42),
        day: 'FR',
        setPos: '2',
        interval: '',
      },
      {
        name: 'every 2 month on the second friday',
        oldDate: new Date(2024, 0, 5, 13, 42),
        newDate: new Date(2024, 2, 8, 13, 42),
        day: 'FR',
        setPos: '2',
        interval: '2',
      },
    ];

    tests.forEach(({ name, oldDate, newDate, day, setPos, interval }) => {
      it(`try parsing \'${name}\'`, function () {
        const res = _testing_date_helper.getDateByDayAndSetPos(oldDate, day, setPos, interval);
        assert.deepStrictEqual(res, newDate);
      });
    });
  });
});
