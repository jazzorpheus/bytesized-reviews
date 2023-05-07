// Node Packages
const express = require('express');
// Create Express Router
const router = express.Router();
// Mongoose Models
const Review = require('../models/review');
// Controllers
const reviews = require('../controllers/reviews');
// Error Handling Utilities
const wrapAsync = require('../utilities/wrapAsync');
// Middleware Imports
const { isLoggedIn, isAuthor, validateReview } = require('../middleware');

// Multer: For parsing 'multipart' form data (needed for image uploads)
const multer = require('multer');
// Multer/Cloudinary: Import storage object connected to cloudinary [see index.js in Cloudinary folder]
// (Don't need to specify 'index.js' file in cloudinary folder as package knows to look for it)
const { storage } = require('../cloudinary');
// Multer: execute multer and specify destination for files, i.e. 'storage' imported above
const upload = multer({ storage });
// Cloudinary
const { cloudinary } = require('../cloudinary');

//***********************************************//
//***************** REVIEW ROUTES *****************//
//***********************************************//

router.route('/')
    // INDEX OF ALL REVIEWS
    .get(wrapAsync(reviews.index))
    // NEW REVIEW (POST)
    // "upload.single(<name>)" is the multer middleware function to parse image file in form
    .post(isLoggedIn, upload.single('image'), validateReview, wrapAsync(reviews.createReview));

// ALL REVIEWS BY USER
router.get('/user/:userId', reviews.user);

// NEW REVIEW (FORM)
router.get('/new', isLoggedIn, reviews.newForm);

router.route('/:id')
    // SHOW REVIEW
    .get(wrapAsync(reviews.showReview))
    // UPDATE REVIEW (PATCH)
    .patch(isLoggedIn, isAuthor, upload.single('image'), validateReview, wrapAsync(reviews.updateReview))
    // DELETE REVIEW
    .delete(isLoggedIn, isAuthor, wrapAsync(reviews.deleteReview));

// UPDATE REVIEW (FORM)
router.get('/:id/edit', isLoggedIn, isAuthor, wrapAsync(reviews.editForm));

// Export Router
module.exports = router;