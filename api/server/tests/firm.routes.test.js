const test = require('node:test');
const assert = require('node:assert/strict');
const { isPrivilegedRole, seatLimitExceeded } = require('../routes/firm');

test('isPrivilegedRole allows owner/admin only', () => {
  assert.equal(isPrivilegedRole('owner'), true);
  assert.equal(isPrivilegedRole('admin'), true);
  assert.equal(isPrivilegedRole('staff'), false);
});

test('seatLimitExceeded checks used seats against limit', () => {
  assert.equal(seatLimitExceeded({ seat_used: 1, seat_limit: 2 }), false);
  assert.equal(seatLimitExceeded({ seat_used: 2, seat_limit: 2 }), true);
  assert.equal(seatLimitExceeded({ seat_used: 3, seat_limit: 2 }), true);
});
