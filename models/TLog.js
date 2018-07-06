const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const TLogSchema = new Schema({
  from: {
    type: String,
    max:3,
    required: true
  },
  rateOfFrom: {
    type: Number,
    min: 0,
    max: 99999,
    required: true
  },
  to: {
    type: String,
    max:3,
    required: true
  },
  rateOfTo: {
    type: Number,
    min: 0,
    max: 99999,
    required: true
  },
  amount: {
    type: Number,
    min: 1,
    max: 999999999999999,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = TLog = mongoose.model('tLog', TLogSchema);
