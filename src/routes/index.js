/* eslint-disable prefer-destructuring */
const express = require("express");
const connectEnsureLogin = require("connect-ensure-login");

const Vehicle = require("../models/Vehicle");
const Issue = require("../models/Issue");
const Operator = require("../models/Issue");

const router = express.Router();

// ROUTES

// Inspection Route
router.get("/", connectEnsureLogin.ensureLoggedIn("/auth/login"), async (req, res) => {
  let vehicleCount = await Vehicle.find({}).countDocuments();
  let issueCount = await Issue.find({}).countDocuments();
  let operatorCount = await Operator.find({}).countDocuments();
  res.render("index", { vehicleCount, issueCount, operatorCount });
});

module.exports = router;
