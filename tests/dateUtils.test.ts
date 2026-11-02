import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  formatReadableDate,
  formatTime12h,
  getTodayDateString,
  getStartOfWeek,
  getWeekDays,
  getMonthMatrix,
  calculateTimeRemaining,
} from '../src/utils/dateUtils.ts';

describe('dateUtils test suite', () => {
  it('formatReadableDate formats YYYY-MM-DD correctly', () => {
    const formatted = formatReadableDate('2026-11-14');
    assert.match(formatted, /Nov 14, 2026/);
    assert.equal(formatReadableDate(''), '');
  });

  it('formatTime12h converts 24h string to 12h AM/PM representation', () => {
    assert.equal(formatTime12h('10:00'), '10:00 AM');
    assert.equal(formatTime12h('12:00'), '12:00 PM');
    assert.equal(formatTime12h('14:30'), '2:30 PM');
    assert.equal(formatTime12h('00:15'), '12:15 AM');
    assert.equal(formatTime12h(''), '');
  });

  it('getTodayDateString produces valid YYYY-MM-DD format', () => {
    const today = getTodayDateString();
    assert.match(today, /^\d{4}-\d{2}-\d{2}$/);
  });

  it('getStartOfWeek returns Monday of the current week', () => {
    const testDate = new Date(2026, 10, 18); // Wednesday, Nov 18, 2026
    const startOfWeek = getStartOfWeek(testDate);
    assert.equal(startOfWeek.getDay(), 1); // 1 = Monday
  });

  it('getWeekDays produces exactly 7 consecutive days', () => {
    const monday = new Date(2026, 10, 16);
    const week = getWeekDays(monday);
    assert.equal(week.length, 7);
    assert.equal(week[0].dayName, 'Mon');
    assert.equal(week[6].dayName, 'Sun');
  });

  it('getMonthMatrix produces multiple-of-7 grid covering month days', () => {
    const matrix = getMonthMatrix(2026, 10); // November 2026 (monthIndex 10)
    assert.equal(matrix.length % 7, 0);
    const novDays = matrix.filter((d) => d.isCurrentMonth);
    assert.equal(novDays.length, 30); // November has 30 days
  });

  it('calculateTimeRemaining returns descriptive relative time or completion', () => {
    const pastResult = calculateTimeRemaining('2020-01-01', '10:00');
    assert.match(pastResult, /Started|Completed/);

    const farFuture = calculateTimeRemaining('2035-12-31', '18:00');
    assert.match(farFuture, /In \d+ days/);
  });
});
