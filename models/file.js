'use strict';

module.exports = function (mongoose) {
  var schema = mongoose.Schema({
    register: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    filePath: String,
    originName: String,
    registered: {
      type: Date,
      default: Date.now
    }
  });

  return mongoose.model('File', schema);
};