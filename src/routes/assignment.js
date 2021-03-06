const express = require("express");
// const mongoose = require("mongoose");
const Assignment = require("../models/Assignment");
const Operator = require("../models/Operator");
const Vehicle = require("../models/Vehicle");

const router = express.Router();

router.get("/add", async (req, res) => {
  const operators = await Operator.find({});
  const vehicles = await Vehicle.find({});
  res.render("assignments/add", {
    operators,
    vehicles
  });
});

router.post("/add", async (req, res) => {
  const { vehicle, operator, startDate, endDate, tripDetails } = req.body;
  console.log(req.body);
  const assignments = new Assignment({
    vehicle,
    operator,
    startDate,
    endDate,
    tripDetails
  });

  await assignments.save();
  res.redirect("/assignment/all");
});

router.get("/all", async (req, res) => {
  const assignments = await Assignment.find({}).populate("vehicle operator"); // Populate func returns ID
  res.render("assignments/all", {
    assignments
  });
});

module.exports = router;
