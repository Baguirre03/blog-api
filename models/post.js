/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');

const { Schema } = mongoose;
const { DateTime } = require('luxon');

const postSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'user' },
  time: { type: Date },
  text: { type: String, required: true },
  comments: { type: Array },
});

postSchema.virtual('date_formatted').get(function () {
  return DateTime.fromJSDate(this.time).toLocaleString(DateTime.DATETIME_MED);
});

postSchema.virtual('url').get(function () {
  return `/${this._id}/delete`;
});

module.exports = mongoose.model('post', postSchema);
