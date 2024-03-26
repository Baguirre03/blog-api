const mongoose = require('mongoose');

const { Schema } = mongoose;

const commentSchema = new Schema({
  user: { type: Schema.TypesObjectId, ref: 'user' },
  date: { type: Date },
  text: { type: String, required: true },
});

module.exports = mongoose.model('comment', commentSchema);
