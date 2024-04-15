const mongoose = require('mongoose');

const { Schema } = mongoose;

const commentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'user' },
  date: { type: Date },
  text: { type: String, required: true },
  article: { type: Schema.Types.ObjectId, ref: 'posts' },
});

module.exports = mongoose.model('comment', commentSchema);
