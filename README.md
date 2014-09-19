# jumbo-mortgage [![Build Status](https://secure.travis-ci.org/cfpb/jumbo-mortgage.png?branch=master)](http://travis-ci.org/cfpb/jumbo-mortgage)

[![NPM](https://nodei.co/npm/jumbo-mortgage.png?downloads=true)](https://nodei.co/npm/jumbo-mortgage/)

[![browser support](https://ci.testling.com/cfpb/jumbo-mortgage.png)
](https://ci.testling.com/cfpb/jumbo-mortgage)

> Tells you if a loan is "jumbo".

## Installation

First install [node.js](http://nodejs.org/). Then:

```sh
npm install jumbo-mortgage --save
```

Grab the `dist/jumbo-mortgage.js` file and include it at the bottom of your page:

```html
<script src="jumbo-mortgage.js"></script>
```

Or use [Browserify](http://browserify.org/):

```sh
npm install jumbo-mortgage --save
var jumbo-mortgage = require('jumbo-mortgage');
```

## Usage

```javascript
var loan = jumbo({
  loanType: 'conf', // conf (conforming), fha or va
  loanAmount: 250000
});

console.log( loan ); // { success: true, isJumbo: false }
```

```javascript
// Loans above $417k *might* be jumbo. It depends on the county. You'll need to provide county limits.
var loan = jumbo({
  loanType: 'conf',
  loanAmount: 450000
});

console.log( loan ); // { success: false, needCounty: true, msg: 'Please provide county limits.' }
```

```javascript
// These county limits are for Alameda County, CA.
loan = jumbo({
  loanType: 'conf',
  loanAmount: 750000,
  gseCountyLimit: 625500,
  fhaCountyLimit: 625500,
  vaCountyLimit: 1050000
});

console.log( loan );
// {
//   success: true,
//   isJumbo: true,
//   type: 'jumbo',
//   msg: 'When you borrow more than $625,500 in your county, the only loan type available to you is a jumbo (non-conforming) loan.'
// }
```

## Contributing

Please read the [Contributing guidelines](CONTRIBUTING.md).

### Running Tests

We are using [nodeunit](https://github.com/caolan/nodeunit) to test. To run tests, first install nodeunit and any dependencies via npm:

```
npm install
```

Run tests with:

```
npm test
```

## License

The project is in the public domain within the United States, and
copyright and related rights in the work worldwide are waived through
the [CC0 1.0 Universal public domain dedication](http://creativecommons.org/publicdomain/zero/1.0/).

All contributions to this project will be released under the CC0
dedication. By submitting a pull request, you are agreeing to comply
with this waiver of copyright interest.

Software source code previously released under an open source license and then modified by CFPB staff is considered a "joint work" (see 17 USC § 101); it is partially copyrighted, partially public domain, and as a whole is protected by the copyrights of the non-government authors and must be released according to the terms of the original open-source license.

For further details, please see: http://www.consumerfinance.gov/developers/sourcecodepolicy/