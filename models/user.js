const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    required: true,
    unique: true,
    lowercase: true,
    dropDups: true
  },
  password: {type: String, required: true}
});

module.exports = mongoose.model('User', userSchema);