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
  },
  'When user chooses Conventional + loan amount >= $417k': function(test) {

    var loan = jumbo({
      loanType: 'conf',
      loanAmount: 450000,
      gseCountyLimit: 450001
    });
    test.equal(
      JSON.stringify(loan),
      '{"success":true,"isJumbo":true,"type":"agency","msg":"When you borrow between 417000 and 450001 in your county, you are eligible for a conforming jumbo loan."}',
      'conforming jumbo loan.'
    );

    loan = jumbo({
      loanType: 'conf',
      loanAmount: 450001,
      gseCountyLimit: 450000
    });
    test.equal(
      JSON.stringify(loan),
      '{"success":true,"isJumbo":true,"type":"jumbo","msg":"When you borrow more than 450000 in your county, the only loan type available to you is a jumbo (non-conforming) loan."}',
      'conforming jumbo loan.'
    );

    test.done();
  },
  'When user chooses FHA + loan amount >= $271,050': function(test) {

    var loan = jumbo({
      loanType: 'fha',
      loanAmount: 416000,
      gseCountyLimit: 416001,
      fhaCountyLimit: 416001
    });
    test.equal(
      JSON.stringify(loan),
      '{"success":true,"isJumbo":true,"type":"fha-hb","msg":"When you borrow between 271050 and 416001 in your county, you are eligible for a high-balance FHA loan."}',
      'loan amount is under the max FHA loan amount IN THAT COUNTY'
    );

    loan = jumbo({
      loanType: 'fha',
      loanAmount: 416000,
      gseCountyLimit: 415000,
      fhaCountyLimit: 415000
    });
    test.equal(
      JSON.stringify(loan),
      '{"success":true,"isJumbo":true,"type":"conf","msg":"You are not eligible for an FHA loan when you borrow more than 415000 in your county. You are eligible for a conventional loan."}',
      'loan amount is above the max FHA loan amount FOR THAT COUNTY and less than $417,000'
    );

    loan = jumbo({
      loanType: 'fha',
      loanAmount: 417000,
      gseCountyLimit: 415000,
      fhaCountyLimit: 415000
    });
    test.equal(
      JSON.stringify(loan),
      '{"success":true,"isJumbo":true,"type":"conf","msg":"You are not eligible for an FHA loan when you borrow more than 415000 in your county. You are eligible for a conventional loan."}',
      'loan amount is above the max FHA loan amount FOR THAT COUNTY and equal to $417,000'
    );

    test.done();
  }
};
