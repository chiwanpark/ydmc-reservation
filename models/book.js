'use strict';

module.exports = function (mongoose) {
  var schema = mongoose.Schema({
    register: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    schoolName: String,
    preference: Number,
    date: Date,
    deprecated: Boolean,
    registered: {
      type: Date,
      default: Date.now
    }
  });

  return mongoose.model('Book', schema);
};