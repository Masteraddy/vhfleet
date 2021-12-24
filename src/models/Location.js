/* eslint-disable prefer-destructuring */
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const locationSchema = new Schema({
  vehicle: {
    type: Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true
  },
  longitude: {
    type: String,
    required: true
  },
  latitude: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Location", locationSchema);
// Mongoose creates the name of the collection as the plural of user
