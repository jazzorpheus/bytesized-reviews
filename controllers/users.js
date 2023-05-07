// Mongoose Models
const User = require('../models/user');

//***********************************************//
//*************** USERS CONTROLLERS ***************//
//***********************************************//

// REGISTER (FORM)
module.exports.registerForm = (req, res) => {
    res.render('users/register');
}
// REGISTER (POST)
module.exports.registerPost = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        // req.login() comes with Passport and can be used to establish a login session
        // Primarily used during registering/signing up
        // Need to pass in a user and a callback
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('newUser', "Welcome to Bitesized Book Reviews!");
            res.redirect('/reviews');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

// LOGIN (FORM)
module.exports.loginForm = (req, res) => {
    res.render('users/login');
}
// LOGIN (POST)
module.exports.loginPost = (req, res) => {
    req.flash('login', 'Welcome back =)');
    // If user tried accessing something before logging in, save the URL they were trying to access [also see middleware.js]
    const redirectUrl = req.session.returnTo || '/reviews';
    // Clear req.session.returnTo
    // 'delete' is a keyword we can use to delete from an object
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

// LOGOUT
module.exports.logout = (req, res) => {
    // Passport adds a logout() method to the request object that removes the req.user property and clears the login session
    // Also takes a callback as argument
    req.logout((err) => {
        if (err) return next(err);
        req.flash('logout', "Logged out.");
        res.redirect('/reviews');
    });
}