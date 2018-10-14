const mongoose = require('mongoose');

const BooksSchema = new mongoose.Schema({
  title: String,
  author: String,
  ocupied: {
    type: Boolean,
    default: false
  },
  pages: Number,
});

module.exports = BooksSchema;
