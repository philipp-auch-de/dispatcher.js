import assert from 'assert';
import { _testing_calendar } from '../src/origins/calendar.js';


describe('Calendar tests', function () {
  this.timeout(5000);
  this.slow(50);

    tests.forEach(({ name, args, expected }) => {
      it(`try parsing \'${name}\'`, function () {
        const res = _testing_calendar.convertRepeatingEvents(args);
        assert.strictEqual(res, expected);
      });
    });
  });

  describe('parse rrules', function () {
    const tests = [
      // Week tests
      {
        name: 'every week',
        rrule: 'FREQ=WEEKLY',
        oldDate: new Date(2024, 0, 13, 13, 42),
        newDate: new Date(2024, 0, 20, 13, 42),
      },
      {
        name: 'every 2 weeks',
        rrule: 'FREQ=WEEKLY;INTERVAL=2',
        oldDate: new Date(2024, 0, 13, 13, 42),
        newDate: new Date(2024, 0, 27, 13, 42),
      },
      {
        name: 'every 4 weeks',
        rrule: 'FREQ=WEEKLY;INTERVAL=4',
        oldDate: new Date(2024, 0, 13, 13, 42),
        newDate: new Date(2024, 1, 10, 13, 42),
      },
      // Month tests
      {
        name: 'every month on a set date',
        rrule: 'FREQ=MONTHLY;BYMONTHDAY=10',
        oldDate: new Date(2024, 0, 10, 13, 42),
        newDate: new Date(2024, 1, 10, 13, 42),
      },
      {
        name: 'every month on the first friday',
        rrule: 'FREQ=MONTHLY;BYSETPOS=1;BYDAY=FR;',
        oldDate: new Date(2024, 0, 5, 13, 42),
        newDate: new Date(2024, 1, 2, 13, 42),
      },
      {
        name: 'every 2 month on the first friday',
        rrule: 'FREQ=MONTHLY;BYSETPOS=1;BYDAY=FR;INTERVAL=2',
        oldDate: new Date(2024, 0, 5, 13, 42),
        newDate: new Date(2024, 2, 1, 13, 42),
      },
    ];

    tests.forEach(({ name, rrule, oldDate, newDate }) => {
      it(`try parsing \'${name}\'`, function () {
        const res = _testing_calendar.calculateNextDate(rrule, oldDate);
        assert.deepStrictEqual(res, newDate);
      });
    });
  });
});
