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
  'When user chooses conventional + loan amount >= $484,350': function(test) {

    var loan = jumbo({
      loanType: 'conf',
      loanAmount: 500000,
      gseCountyLimit: 500001,
    });
    test.equal(
      JSON.stringify(loan),
      '{"success":true,"isJumbo":true,"type":"agency","msg":"When you borrow between $484,350 and $500,001 in your county, you are eligible for a conforming jumbo loan."}',
      'the loan amount is equal to or less than the max GSE loan amount for conforming jumbo IN THAT COUNTY'
    );

    loan = jumbo({
      loanType: 'conf',
      loanAmount: 500001,
      gseCountyLimit: 500000,
    });
    test.equal(
      JSON.stringify(loan),
      '{"success":true,"isJumbo":true,"type":"jumbo","msg":"When you borrow more than $500,000 in your county, the only loan type available to you is a jumbo (non-conforming) loan."}',
      'loan amount is above the max GSE loan amount for conforming jumbo IN THAT COUNTY'
    );

    test.done();
  },
  'When user chooses FHA + loan amount >= $275,665': function(test) {

    var loan = jumbo({
      loanType: 'fha',
      loanAmount: 416000,
      gseCountyLimit: 416001,
      fhaCountyLimit: 416001
    });
    test.equal(
      JSON.stringify(loan),
      '{"success":true,"isJumbo":true,"type":"fha-hb","msg":"When you borrow between $314,827 and $416,001 in your county, you are eligible for a high-balance FHA loan."}',
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
      '{"success":true,"isJumbo":true,"type":"conf","msg":"You are not eligible for an FHA loan when you borrow more than $415,000 in your county. You are eligible for a conventional loan."}',
      'loan amount is above the max FHA loan amount FOR THAT COUNTY and less than $424,100'
    );

    loan = jumbo({
      loanType: 'fha',
      loanAmount: 417000,
      gseCountyLimit: 415000,
      fhaCountyLimit: 415000
    });
    test.equal(
      JSON.stringify(loan),
      '{"success":true,"isJumbo":true,"type":"conf","msg":"You are not eligible for an FHA loan when you borrow more than $415,000 in your county. You are eligible for a conventional loan."}',
      'loan amount is above the max FHA loan amount FOR THAT COUNTY and equal to $424,100'
    );

    loan = jumbo({
      loanType: 'fha',
      loanAmount: 484351,
      gseCountyLimit: 484351,
      fhaCountyLimit: 200000
    });
    test.equal(
      JSON.stringify(loan),
      '{"success":true,"isJumbo":true,"type":"agency","msg":"You are not eligible for an FHA loan when you borrow more than $200,000 in your county. You are eligible for a conforming jumbo loan."}',
      'loan amount is above the max FHA loan amount FOR THAT COUNTY AND loan amount is higher than $424,100 AND equal to the max GSE loan amount for conforming jumbo IN THAT COUNTY'
    );

    loan = jumbo({
      loanType: 'fha',
      loanAmount: 484351,
      gseCountyLimit: 484352,
      fhaCountyLimit: 200000
    });
    test.equal(
      JSON.stringify(loan),
      '{"success":true,"isJumbo":true,"type":"agency","msg":"You are not eligible for an FHA loan when you borrow more than $200,000 in your county. You are eligible for a conforming jumbo loan."}',
      'loan amount is above the max FHA loan amount FOR THAT COUNTY AND loan amount is higher than $424,100 AND less than the max GSE loan amount for conforming jumbo IN THAT COUNTY'
    );

    loan = jumbo({
      loanType: 'fha',
      loanAmount: 484352,
      gseCountyLimit: 484351,
      fhaCountyLimit: 200000
    });
    test.equal(
      JSON.stringify(loan),
      '{"success":true,"isJumbo":true,"type":"jumbo","msg":"You are not eligible for an FHA loan when you borrow more than $200,000 in your county. The only loan type available to you at this loan amount is a jumbo (non-conforming) loan."}',
      'loan amount is above the max FHA loan amount FOR THAT COUNTY AND the loan amount is above $424,100 AND above than the max GSE loan amount for conforming jumbo IN THAT COUNTY'
    );

    test.done();
  },
  'When user chooses VA + Loan amount >= $424,100': function(test) {

    var loan = jumbo({
      loanType: 'va',
      loanAmount: 500000,
      gseCountyLimit: 500001,
      vaCountyLimit: 500001
    });
    test.equal(
      JSON.stringify(loan),
      '{"success":true,"isJumbo":true,"type":"va-hb","msg":"When you borrow between $484,350 and $500,001 in your county, you may be eligible for a high-balance VA loan."}',
      'loan amount is > $424,100 but under the max VA loan amount for that county'
    );

    loan = jumbo({
      loanType: 'va',
      loanAmount: 500001,
      gseCountyLimit: 500002,
      vaCountyLimit: 500000
    });
    test.equal(
      JSON.stringify(loan),
      '{"success":true,"isJumbo":true,"type":"agency","msg":"While VA loans do not have strict loan limits, most lenders are unlikely to make a VA loan more than $500,000 in your county. Your only option may be a conforming jumbo loan."}',
      'loan amount is above the max VA loan amount for that county and below the GSE limit for that county'
    );

    loan = jumbo({
      loanType: 'va',
      loanAmount: 500001,
      gseCountyLimit: 500000,
      vaCountyLimit: 500000
    });
    test.equal(
      JSON.stringify(loan),
      '{"success":true,"isJumbo":true,"type":"jumbo","msg":"While VA loans do not have strict loan limits, most lenders are unlikely to make a VA loan more than $500,000 in your county. Your only option may be a jumbo (non-conforming) loan."}',
      'loan amount is above the max GSE loan amount for conforming jumbo loans for that county'
    );

    test.done();
  }
};
