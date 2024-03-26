const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  admin: { type: Boolean },
});

module.exports = mongoose.model('user', userSchema);
