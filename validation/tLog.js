const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data) {
  let errors = {};

  data.from = !isEmpty(data.from) ? data.from : '';
  data.to = !isEmpty(data.to) ? data.to : '';
  data.amount = !isEmpty(data.amount) ? data.amount : '';

  if (!validator.isLength(data.from, { min: 3, max: 3 })) {
    errors.text = 'From currency must be 3 characters only';
  }

    // checks if value contains any invalid character
    if(/[^A-Z]/.test(data.from)) {
      errors.text = 'No special characters or numbers allowed (capital letters only) !';
    }

    if(/[^A-Z]/.test(data.to)) {
      errors.text = 'No special characters or numbers allowed (capital letters only) !';
    }

  if (!validator.isLength(data.to, { min: 3, max: 3 })) {
    errors.text = 'To currency must be 3 characters only';
  }

  if (!validator.isDecimal(data.amount)) {
    errors.text = 'not a valid number';
  }

  if (data.amount < 1 || data.amount > 999999999999999) {
    errors.text = 'Amount range between 1 and 999999999999999';
  }

  if (validator.isEmpty(data.from)) {
    errors.text = 'From field is required';
  }
  if (validator.isEmpty(data.to)) {
    errors.text = 'To field is required';
  }
  if (validator.isEmpty(data.amount)) {
    errors.text = 'Amount field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
