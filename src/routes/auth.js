const express = require("express");

const User = require("../models/User");

const bcrypt = require("bcryptjs");
const passport = require("passport");

const router = express.Router();

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login?info=Login Error",
    failureFlash: true,
    passReqToCallback: true,
  })
);
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", async (req, res) => {
  let { email, password, companyName } = req.body;
  let foundUser = await User.findOne({
    email: email,
  });
  if (foundUser) {
    //TODO; remember to add flash message
    return res.redirect("/auth/login");
  } else {
    let hashedPwd = await bcrypt.hash(password, 12);
    if (hashedPwd) {
      const newUser = new User({
        companyName,
        email,
        password: hashedPwd,
      });
      await newUser.save();
      return res.redirect("/auth/login");
    }
  }
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/auth/login");
});

module.exports = router;
