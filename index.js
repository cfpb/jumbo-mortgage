/*
 * jumbo-mortgage
 *
 * A work of the public domain from the Consumer Financial Protection Bureau.
 */

'use strict';

var formatUSD = require('format-usd');

function usd( num ) {
  return formatUSD(num, {decimalPlaces: 0});
}

function getJumboLoanType( opts ) {

  opts = opts || {};

  var amount = opts.loanAmount || 0,
      type = opts.loanType,
      limits = {};

  // Each loan type has a standard limit and may optionally have a lower
  // one based on the relevant county.
  limits.gse = {
    defaultVal: 806500,
    county: opts.gseCountyLimit
  };
  limits.fha = {
    defaultVal: 524225,
    county: opts.fhaCountyLimit
  };
  limits.va = {
    defaultVal: 806500,
    county: opts.vaCountyLimit
  };

  switch ( type ) {
    case 'conf':
    case 'agency':
    case 'jumbo':
      return processConfLoan( amount, limits );
    case 'fha':
    case 'fha-hb':
      return processFHALoan( amount, limits );
    case 'va':
    case 'va-hb':
      return processVALoan( amount, limits );
    defaultVal:
      return fail();
  }

}

function processConfLoan( amount, limits ) {
  if ( amount > limits.gse.defaultVal ) {
    if ( !limits.gse.county ) {
      return fail('county');
    }
    if ( amount <= limits.gse.county ) {
      return success('agency', 'When you borrow between ' + usd( limits.gse.defaultVal ) + ' and ' + usd( limits.gse.county ) + ' in your county, you are eligible for a conforming jumbo loan.');
    }
    if ( amount > limits.gse.county ) {
      return success('jumbo', 'When you borrow more than ' + usd( limits.gse.county ) + ' in your county, the only loan type available to you is a jumbo (non-conforming) loan.');
    }
  }
  // It ain't jumbo
  return success();
}

function processFHALoan( amount, limits ) {
  if ( amount > limits.fha.defaultVal ) {
    if ( !limits.gse.county || !limits.fha.county ) {
      return fail('county');
    }
    if ( amount <= limits.fha.county ) {
      return success('fha-hb', 'When you borrow between ' + usd( limits.fha.defaultVal ) + ' and ' + usd( limits.fha.county ) + ' in your county, you are eligible for a high-balance FHA loan.');
    }
    if ( amount > limits.fha.county && amount <= limits.gse.defaultVal ) {
      return success('conf', 'You are not eligible for an FHA loan when you borrow more than ' + usd( limits.fha.county ) + ' in your county. You are eligible for a conventional loan.');
    }
    if ( amount > limits.gse.defaultVal && amount <= limits.gse.county ) {
      return success('agency', 'You are not eligible for an FHA loan when you borrow more than ' + usd( limits.fha.county ) + ' in your county. You are eligible for a conforming jumbo loan.');
    }
    if ( amount > limits.gse.defaultVal && amount > limits.gse.county ) {
      return success('jumbo', 'You are not eligible for an FHA loan when you borrow more than ' + usd( limits.fha.county ) + ' in your county. The only loan type available to you at this loan amount is a jumbo (non-conforming) loan.');
    }
  }
  // It ain't jumbo
  return success();
}

function processVALoan( amount, limits ) {
  if ( amount > limits.va.defaultVal ) {
    if ( !limits.gse.county || !limits.va.county ) {
      return fail('county');
    }
    if ( amount <= limits.va.county ) {
      return success('va-hb', 'When you borrow between ' + usd( limits.va.defaultVal ) + ' and ' + usd(  limits.va.county ) + ' in your county, you may be eligible for a high-balance VA loan.');
    }
    if ( amount > limits.va.county && amount < limits.gse.county ) {
      return success('agency', 'While VA loans do not have strict loan limits, most lenders are unlikely to make a VA loan more than ' + usd( limits.va.county ) + ' in your county. Your only option may be a conforming jumbo loan.');
    }
    if ( amount > limits.gse.county ) {
      return success('jumbo', 'While VA loans do not have strict loan limits, most lenders are unlikely to make a VA loan more than ' + usd( limits.va.county ) + ' in your county. Your only option may be a jumbo (non-conforming) loan.');
    }
  }
  // It ain't jumbo
  return success();
}

function success( type, msg ) {

  if ( type ) {
    return {
      success: true,
      isJumbo: true,
      type: type,
      msg: msg || undefined
    };
  }

  // If no loan type is provided, indicate that it's not a jumbo
  // loan and nothing needs to be changed.
  return {
    success: true,
    isJumbo: false
  };

}

function fail( status ) {

  if ( status === 'county' ) {
    return {
      success: false,
      needCounty: true,
      msg: 'Please provide county limits.'
    };
  }

  return {
    success: false,
    msg: 'Unknown loan type.'
  };

}

module.exports = getJumboLoanType;
