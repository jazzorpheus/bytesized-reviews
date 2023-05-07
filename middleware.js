// Mongoose Models
const Review = require('./models/review');
const Comment = require('./models/comment');

// JOI Schemas
const { reviewSchema, commentSchema } = require('./schemas');

// Error-handling Utilities
const AppError = require('./utilities/AppError');

//*****************************************************************************     MIDDLEWARE   */


// Check if client is logged in
module.exports.isLoggedIn = (req, res, next) => {
    // isAuthenticated() is a Passport method added to the request object that returns true or false 
    // depending on if the user has been successfully passport.authenticate()'d!
    if (!req.isAuthenticated()) {
        // Save (in the session) where the user was trying to access before being redirected to login page [see login route in routes/users.js]
        req.session.returnTo = req.originalUrl;
        req.flash('error', "You must be logged in to do that!");
        return res.redirect('/login');
    }
    next();
}

// Check if current user is the author of shown review
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const review = await Review.findById(id);
    if (!review.user.equals(req.user._id)) {
        req.flash('error', "You do not have permission to do that!");
        return res.redirect(`/reviews/${id}`);
    }
    next();
}

// Check if current user is the user who wrote the comment they're trying to delete
module.exports.isCommentAuthor = async (req, res, next) => {
    const { id, commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment.user.equals(req.user._id)) {
        req.flash('error', "You do not have permission to do that!");
        return res.redirect(`/reviews/${id}`);
    }
    next();
}


// JOI Middleware: function to validate /new and /edit form data before saving to MongoDB
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new AppError(msg, 400);
    } else {
        next();
    }
}

// JOI Middleware: function to validate comments form data before saving to MongoDB
module.exports.validateComment = (req, res, next) => {
    const { error } = commentSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new AppError(msg, 400);
    } else {
        next();
    }
}