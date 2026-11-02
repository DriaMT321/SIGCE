import assert from 'node:assert/strict';
import { test } from 'node:test';
import { escapeCsvCell } from './celdaseguracsv';

test('neutralizes spreadsheet formulas in exported cells', () => {
  for (const value of ['=1+1', '+SUM(A1:A2)', '-2+3', '@SUM(A1)', '  =1+1']) {
    assert.equal(escapeCsvCell(value), `"'${value.replace(/"/g, '""')}"`);
  }
});

test('keeps ordinary CSV escaping and empty values', () => {
  assert.equal(escapeCsvCell('Ana "Anita" Rojas'), '"Ana ""Anita"" Rojas"');
  assert.equal(escapeCsvCell(null), '""');
});
