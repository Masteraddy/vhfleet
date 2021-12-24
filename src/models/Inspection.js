/* eslint-disable prefer-destructuring */
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const inspectionSchema = new Schema({
  vehicleIssue: {
    type: Schema.Types.ObjectId,
    ref: "Issue"
  },
  issueDate: {
    type: Date,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String
  }
});

module.exports = mongoose.model("Inspection", inspectionSchema);
// Mongoose creates the name of the collection as the plural of user
