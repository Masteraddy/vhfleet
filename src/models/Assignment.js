const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const assignmentsSchema = new Schema(
  {
    vehicle: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
      required: false
    },
    operator: {
      type: Schema.Types.ObjectId,
      ref: "Operator",
      required: false
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    tripDetails: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("assignments", assignmentsSchema);
