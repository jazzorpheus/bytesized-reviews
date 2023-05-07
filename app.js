//***************************************************//
//*********************** MAIN ************************//
//***************************************************//

// If running in development mode require 'dotenv' package and make .env variables accessible throughout project files
// NOTE:'process.env.NODE_ENV' is an environment variable set to either 'development' or 'production'
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// NPM Packages
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const passportLocal = require("passport-local");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const morgan = require("morgan");

// Start Express
const app = express();

// Connect to database
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/book-reviews";
mongoose
  .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("CONNECTED to MongoDB");
  })
  .catch((err) => {
    console.log("ERROR CONNECTING to MongoDB");
    console.log(err);
  });

// Mongoose Models
const User = require("./models/user");

// Express Routers/Routes
const userRoutes = require("./routes/users");
const reviewRoutes = require("./routes/reviews");
const commentRoutes = require("./routes/comments");

// Error-handling Utilities
const AppError = require("./utilities/AppError");

// Useful JS Objects/Variables
const flashMsgs = require("./public/js/flashMsgs");

// Views Settings
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

//**********************************************************************************************    Session */

// Set session secret; env.SECRET provided by the PaaS you're using if in production (I think!)
const secret = process.env.SECRET || "thisisabadsecret!";
// Use MongoDB to store session data
const MongoStore = require("connect-mongo");
const store = MongoStore.create({
  mongoUrl: dbUrl,
  secret: secret,
  // Only update the session data every 24 hours rather than every time the page is refreshed
  // However, if session data changes it will update automatically
  touchAfter: 24 * 60 * 60,
});
store.on("error", function (err) {
  console.log("SESSION STORE ERROR");
  console.log(err);
});
// Session config options that use the MongoStore created above [passed into session() below]
const sessionOptions = {
  store: store,
  // Change session cookie name from 'connect.sid' to custom name
  // (A bit more secure to use custom name)
  name: "session-cookie",
  secret: secret,
  // If true, forces the session to be saved back to the session store, even if the session was never modified during the request
  resave: false,
  // Forces a session that is "uninitialized" to be saved to the store. A session is uninitialized when it is new but not modified.
  saveUninitialized: true,
  cookie: {
    // Security measure: Ensures cookie cannot be accessed through client-side scripts
    // Protects cookie from 3rd parties exploiting cross-site scripting (XSS) flaws
    httpOnly: true,
    // // Ensures cookies can only be configured/changed over https
    // // 'localhost' is not http-secure so will need to comment this out while in development mode
    // secure: true,
    // Make sure cookie expires after one week (units in milliseconds)
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
// Start Session with options passed in
app.use(session(sessionOptions));

//**********************************************************************************************    Middleware */

// Terminal Log of HTTP requests etc.
app.use(morgan("tiny"));
// Serve Static Files
app.use(express.static(path.join(__dirname, "public")));
// Override POST method with PATCH/PUT/DELETE using '_method' where appropriate [see HTML forms]
app.use(methodOverride("_method"));
// Use URL encoded form data
app.use(express.urlencoded({ extended: true }));
// Mongo Sanitize
// Removes prohibited characters from req.body, req.query, & req.params to protect against Mongo injections
// Can replace prohibited characters with another character [see docs]
app.use(mongoSanitize());

// Helmet: sets HTTP headers to help protect against XSS attacks
// Must specify external sources of scripts, styles, fonts, etc. to make an exception for them
// Ensures the contentSecurityPolicy defaults are not violated
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", "https://ka-f.fontawesome.com"],
      scriptSrc: [
        "'unsafe-inline'",
        "'self'",
        "https://kit.fontawesome.com/",
        "https://cdn.jsdelivr.net/",
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://cdn.jsdelivr.net/",
        "https://fonts.googleapis.com",
      ],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/drsopstkf/",
        "https://images.unsplash.com/",
      ],
      fontSrc: [
        "'self'",
        "https://ka-f.fontawesome.com",
        "https://fonts.gstatic.com",
      ],
    },
  })
);

// Start Passport
app.use(passport.initialize());
// For persistent login sessions with Passport (vs. logging in with every single request)
// Needs to be run AFTER express-session, ie. after 'app.use(session(sessionConfig))'
app.use(passport.session());
// Tell Passport to use Passport-Local in conjunction with our User model which has our authentication method, 'authenticate()'
// authenticate() is a static method added automatically by Passport-Local-Mongoose to our User Model [in models/user.js]
passport.use(new passportLocal(User.authenticate()));
// Tells Passport to serialize a user
// Serializing refers to how a user is stored in the session
passport.serializeUser(User.serializeUser());
// Tells Passport to deserialize a user
// Deserializing refers to how a user is taken out of the session
passport.deserializeUser(User.deserializeUser());

// Start Flash
app.use(flash());
// Pass variables to res.locals which will be available within all templates
app.use((req, res, next) => {
  // Used to display active url [see navbar template]
  res.locals.url = req.url;
  // So we can see if a user is logged in when rendering templates (via 'currentUser')
  res.locals.currentUser = req.user;
  // Allows access to flash messages in all templates
  // [flashMsgs is imported above from public folder]
  for (let flash of flashMsgs) {
    // populate 'flashMsgs' with actual flash messages!
    flash.msg = req.flash(flash.key);
  }
  res.locals.flashMsgs = flashMsgs;
  next();
});

//**************************************************************//
//*********************** ROUTERS/ROUTES ************************//
//*************************************************************//

// HOME ROUTE
app.get("/", (req, res) => {
  res.render("home");
});

// USER/AUTHENTICATION ROUTER/ROUTES
app.use("/", userRoutes);

// REVIEWS ROUTER/ROUTES
app.use("/reviews", reviewRoutes);

// COMMENTS ROUTER/ROUTES
app.use("/reviews/:id/comments", commentRoutes);

// 404 NOT FOUND ROUTE
app.all("*", (req, res, next) => {
  next(new AppError("Page Not Found", 404));
});

// GENERIC ERROR HANDLER
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong!";
  res.status(statusCode).render("error", { err });
});

// LISTEN ON PORT DEPENDING ON WHETHER IN PRODUCTION OR DEVELOPMENT MODE
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`LISTENING on port ${port}`);
});
