// IMPORTS //
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const methodOverride = require("method-override");
const path = require("path");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const connectEnsureLogin = require("connect-ensure-login");
const LocalStrategy = require("passport-local");

const User = require("./models/User");

const assignmentRoutes = require("./routes/assignment");
const issueRoutes = require("./routes/issue");
const inspectionRoutes = require("./routes/inspection");
const operatorRoutes = require("./routes/operator");
const vehicleRoutes = require("./routes/vehicle");
const authRoutes = require("./routes/auth");
const indexRoutes = require("./routes/index");

// EXPRESS SETUP
const app = express();
// mongoose.set('useFindAndModify', false);

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost/vhfleetest";

// MONGOOSE CONNECTION
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use(
  session({
    secret: "thisisajustarandomkey_wordforexpression",
    resave: false,
    saveUninitialized: false,
  })
);

/*  PASSPORT SETUP  */

app.use(passport.initialize());
app.use(passport.session());

/* PASSPORT LOCAL AUTHENTICATION */

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ email: username }, (err, user) => {
      // console.log(user);
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return done(null, false);
      }
      return done(null, user);
    });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
// passport.use(UserDetails.createStrategy());

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// VIEW ENGINE SETUP //
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// APPENDING THE PUBLIC FOLDER
app.use(express.static(path.join(__dirname, "public")));

// BODY-PARSER SETUP
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(methodOverride("_method"));

// Using the routes
app.use("/", indexRoutes);
app.use("/issue", issueRoutes);
app.use("/inspection", connectEnsureLogin.ensureLoggedIn("/auth/login"), inspectionRoutes);
app.use("/operator", connectEnsureLogin.ensureLoggedIn("/auth/login"), operatorRoutes);
app.use("/vehicle", vehicleRoutes);
app.use("/auth", authRoutes);
app.use("/assignment", connectEnsureLogin.ensureLoggedIn("/auth/login"), assignmentRoutes);

app.listen(process.env.PORT || 3030, (err) => {
  console.log("Server started");
});
