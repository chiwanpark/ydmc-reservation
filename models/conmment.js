'use strict';

module.exports = function (mongoose) {
  var schema = mongoose.Schema({
    register: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    comment: String,
    registered: {
      type: Date,
      default: Date.now
    }
  });

  return mongoose.model('Comment', schema);
};