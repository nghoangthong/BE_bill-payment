/**
 * Example schema
 * @see http://mongoosejs.com/docs/schematypes.html
 * @type {Model|*|{}}
 */

const mongoose = require('mongoose');

let Schema = mongoose.Schema;
let newSchema = new Schema ({
  title: {
    type: String,
    maxLength: 255
  },
  descriptions: {
    type: String,
    maxLength: 255
  }
}, {
  timestamps: true
});

module.exports = mongoose.model ('New', newSchema);