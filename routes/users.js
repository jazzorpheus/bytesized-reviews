// Node Packages
const express = require('express');
const passport = require('passport');
// Create Express Router
const router = express.Router();
// Mongoose Models
const User = require('../models/user');
// Controllers
const users = require('../controllers/users');
// Error Handling Utilities
const wrapAsync = require('../utilities/wrapAsync');

//************************************************************//
//************************ USERS ROUTES ************************//
//*************************************************************//

// REGISTER
router.route('/register')
    // REGISTER (FORM)
    .get(users.registerForm)
    // REGISTER (POST)
    .post(wrapAsync(users.registerPost));

// LOGIN
router.route('/login')
    // LOGIN (FORM)
    .get(users.loginForm)
    // LOGIN (POST)
    // passport.authenticate() is Passport's authentication middleware that takes a 'strategy' argument
    // Also can pass in some options: failureFlash flashes a message upon error, failureRedirect specifies where to redirect upon error
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), users.loginPost);

// LOGOUT
router.get('/logout', users.logout);

// Export Router
module.exports = router;