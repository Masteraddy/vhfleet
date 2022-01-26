/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
/* eslint-disable prettier/prettier */
const express = require("express");
const Issue = require("../models/Issue");
const Assignment = require("../models/Assignment");
const Operator = require("../models/Operator");
const Vehicle = require("../models/Vehicle");
const connectEnsureLogin = require("connect-ensure-login");

const router = express.Router();

// ROUTES

// Issue Routes
router.get("/add", connectEnsureLogin.ensureLoggedIn("/auth/login"), async (req, res) => {
  const operators = await Operator.find({});
  const vehicles = await Vehicle.find({});
  res.render("issue/add", {
    operators,
    vehicles,
  });
});

// Issue Form Submit Route
router.post("/add", connectEnsureLogin.ensureLoggedIn("/auth/login"), async (req, res) => {
  const { vehicle, date, summary, description, priority, operator } = req.body;

  const issue = new Issue({
    vehicle,
    date,
    summary,
    description,
    priority,
    operator,
  });

  await issue.save();
  res.redirect("/issue/all");
});

// Issue Form Submit Route
router.post("/add-mobile", async (req, res) => {
  const { vehicle, date, summary, description, priority } = req.query;

  try {
    const assign = await Assignment.find({ vehicle })
      .sort("-createdAt")
      .populate("operator")
      .select("operator");
    const operatorDt = assign[0]?.operator;
    const operator = `${operatorDt.firstname} ${operatorDt.lastname}`;

    if (!vehicle || !operator || !summary || !description || !priority) {
      res.status(500).json({ msg: "please enter all required field" });
      return;
    }
    const issue = new Issue({
      vehicle,
      date,
      summary,
      description,
      priority,
      operator,
    });
    await issue.save();
    res.status(201).json({success: true, issue});
  } catch (error) {
    res.status(500).json({ msg: "Error while adding data", error });
  }
});

// Issue-list
router.get("/all", connectEnsureLogin.ensureLoggedIn("/auth/login"), async (req, res) => {
  // const issues = await Issue.find({}).populate("vehicle"); // Populate function returns ID
  const issues = await Issue.find({}).populate("vehicle");
  // console.log(issues);
  res.render("issue/all", {
    issues,
  });
});

// Edit Route
router.get("/edit/:id", connectEnsureLogin.ensureLoggedIn("/auth/login"), async (req, res) => {
  // eslint-disable-next-line prefer-destructuring
  const id = req.params.id;
  const { vehicle, date, summary, description, priority, operator } = await Issue.findOne({
    _id: id,
  }).populate("vehicle");

  const issue = new Issue({
    vehicle,
    date,
    summary,
    description,
    priority,
    operator,
  });

  const operators = await Operator.find({});
  const vehicles = await Vehicle.find({});

  res.render("issue/edit", {
    operators,
    vehicles,
    issue,
  });
});

// Edit Issue Form Post Route
router.put("/edit/:id", connectEnsureLogin.ensureLoggedIn("/auth/login"), async (req, res) => {
  // eslint-disable-next-line prefer-destructuring
  const issue = await Issue.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  issue.save();
  res.redirect("/issue/all");
});

// Delete Route
router.delete("/:id", connectEnsureLogin.ensureLoggedIn("/auth/login"), (req, res) => {
  Issue.findByIdAndDelete({ _id: req.params.id }).then(() => {
    res.redirect("/issue/all");
  });
});

module.exports = router;
