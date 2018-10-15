const mongoose = require('mongoose');
const shortid = require('shortid');

function generateAPIkey() {
  return shortid.generate();
}

const UsersSchema = new mongoose.Schema({
  key: {
    type: String,
    default: generateAPIkey
  },
  username: {
    type: String,
    lowercase: true,
    trim: true,
    //index: true,
    required: true
  },
  password: {
    type: String,
    minlength: 4
  },
  age: {
    type: Number,
    default: 18,
  },
  book_id: String
});

module.exports = UsersSchema;
