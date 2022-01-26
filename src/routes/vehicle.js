const express = require("express");
const Vehicle = require("../models/Vehicle");
const Location = require("../models/Location");
const Issue = require("../models/Issue");
const Assignment = require("../models/Assignment");
const connectEnsureLogin = require("connect-ensure-login");

const router = express.Router();

router.get("/add", connectEnsureLogin.ensureLoggedIn("/auth/login"), (req, res) => {
  res.render("vehicle/add");
});

router.post("/add", connectEnsureLogin.ensureLoggedIn("/auth/login"), (req, res) => {
  const { make, type, vehicleName, color, vin, licensePlate, year, model } = req.body;

  const vehicle = new Vehicle({
    make,
    type,
    vehicleName,
    color,
    vin,
    licensePlate,
    year,
    model,
  });

  vehicle.save(() => {
    res.redirect("/vehicle/all");
  });
});

router.get("/all", connectEnsureLogin.ensureLoggedIn("/auth/login"), async (req, res) => {
  const vehicles = await Vehicle.find({});
  res.render("vehicle/all", {
    vehicles,
  });
});

router.get("/location", async (req, res) => {
  const location = await Location.find({});
  res.json(location);
});

router.get("/location/:id", async (req, res) => {
  const location = await Location.findById(req.params.id);
  res.json(location);
});

router.post("/location", async (req, res) => {
  let dt = req.query;
  const vehicle = await Vehicle.findOne({ _id: dt.carId, vin: dt.vin });
  const location = await Location.findOne({ vehicle: dt.carId });
  if (vehicle) {
    if (location) {
      location.latitude = dt.lat;
      location.longitude = dt.long;
      location.save();
      res.json({ success: true, location });
    } else {
      let newLoc = new Location({
        latitude: dt.lat,
        longitude: dt.long,
        vehicle: dt.carId,
      });
      await newLoc.save();
      res.json({ success: true, location: newLoc });
    }
    return;
  }
  res.json({ success: false });
});

router.post("/location/login", async (req, res) => {
  let dt = req.query;
  const vehicle = await Vehicle.findOne({ _id: dt.carId, vin: dt.vin });
  // console.log(vehicle);
  if (vehicle) {
    res.json({ success: true, vehicle });
    return;
  }
  res.status(401).json({ success: false });
});

router.get("/one/:id", connectEnsureLogin.ensureLoggedIn("/auth/login"), async (req, res) => {
  const id = req.params.id;
  try {
    let foundVehicle = await Vehicle.findOne({ _id: id });
    let foundIssue = await Issue.find({ vehicle: id });
    let assignment = await Assignment.findOne({ vehicle: id })
      .sort({ createdAt: -1 })
      .populate("operator");

    res.render("vehicle/one", {
      vehicle: foundVehicle,
      issue: foundIssue,
      assignment,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/vehicle/all");
  }
});

module.exports = router;
