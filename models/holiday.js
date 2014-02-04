'use strict';

module.exports = function (mongoose) {
  var schema = mongoose.Schema({
    date: Date
  });

  return mongoose.model('Holiday', schema);
};