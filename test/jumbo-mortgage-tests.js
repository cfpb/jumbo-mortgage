'use strict';

var jumbo = require('../index.js');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.jumboMortgage = {
  'non jumbos': function(test) {
    var loan = jumbo({
      loanType: 'conf', // conf, fha or va
      loanAmount: 250000
    });
    test.equal(JSON.stringify(loan), '{"success":true,"isJumbo":false}', 'conf should not be jumbo');
    loan = jumbo({
      loanType: 'fha', // conf, fha or va
      loanAmount: 250000
    });
    test.equal(JSON.stringify(loan), '{"success":true,"isJumbo":false}', 'fha should not be jumbo');
    loan = jumbo({
      loanType: 'va', // conf, fha or va
      loanAmount: 250000
    });
    test.equal(JSON.stringify(loan), '{"success":true,"isJumbo":false}', 'va should not be jumbo');
    test.done();
  }
};
