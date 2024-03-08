let mongoose = require('mongoose');
// let validator = require('validator');

let bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  comments: {
    type: [String],
    // required: true,
  },
});

module.exports = mongoose.model('Book', bookSchema);