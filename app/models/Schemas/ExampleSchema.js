/**
 * Example schema
 * @see http://mongoosejs.com/docs/schematypes.html
 * @type {Model|*|{}}
 */

const mongoose = require('mongoose');

let Schema = mongoose.Schema;
let timestamps = require ('mongoose-timestamp');
let exampleSchema = new Schema ({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  description: String
});

exampleSchema.plugin (timestamps, {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

let ExampleSchema = mongoose.model ('Example', exampleSchema);
module.exports = ExampleSchema;
