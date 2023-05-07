// Mongoose Models
const Review = require('../models/review');
// Cloudinary
const { cloudinary } = require('../cloudinary');

//***********************************************//
//*************** REVIEW CONTROLLERS ***************//
//***********************************************//

// INDEX OF REVIEWS
module.exports.index = async (req, res) => {
    userId = '';
    const reviews = await Review.find({}).populate('user');
    res.render('reviews/index', { reviews });
}

// INDEX OF REVIEWS BY USER
module.exports.user = async (req, res) => {
    const { userId } = req.params;
    const reviews = await Review.find({ user: userId }).populate('user');
    res.render('reviews/index', { reviews, userId });
}

// NEW REVIEW (FORM)
module.exports.newForm = (req, res) => {
    res.render('reviews/new');
}
// NEW REVIEW (POST)
module.exports.createReview = async (req, res, next) => {
    const review = new Review(req.body.review);
    // Add the image, i.e. image url and filename, to the image field of the review
    if (req.file) {
        review.image.url = req.file.path;
        review.image.filename = req.file.filename;
    }
    review.user = req.user._id;
    await review.save();
    req.flash('newReview', "Successfully published new review!");
    res.redirect(`/reviews/${review._id}`);
}

// SHOW REVIEW
module.exports.showReview = async (req, res) => {
    const review = await Review.findById(req.params.id).populate({
        path: 'comments',
        // Nested populate() !
        populate: {
            path: 'user'
        }
    }).populate('user');
    if (!review) {
        req.flash('error', "Cannot find that review.");
        return res.redirect('/reviews');
    }
    res.render('reviews/show', { review });
}

// UPDATE REVIEW (FORM)
module.exports.editForm = async (req, res) => {
    const { id } = req.params;
    const review = await Review.findById(id);
    if (!review) {
        req.flash('error', "Cannot find that review.");
        return res.redirect('/reviews');
    }
    res.render('reviews/edit', { review });
}
// UPDATE REVIEW (PATCH)
module.exports.updateReview = async (req, res) => {
    const { id } = req.params;
    const review = await Review.findByIdAndUpdate(id, req.body.review, { new: true });
    // If user updates image...
    if (req.file) {
        // Delete old image from Cloudinary if there is one
        if (review.image.filename) {
            await cloudinary.uploader.destroy(review.image.filename);
        }
        // Overwrite the image, i.e. image url and filename fields of the image object in the review
        review.image.url = req.file.path;
        review.image.filename = req.file.filename;
        // // Alternative method:
        // await review.updateOne({ image: { url: req.file.path, filename: req.file.filename } });
    }
    await review.save();
    req.flash('updateReview', "Successfully updated review!");
    res.redirect(`/reviews/${id}`);
}

// DELETE REVIEW
module.exports.deleteReview = async (req, res) => {
    const { id } = req.params;
    // Delete from MongoDB
    const review = await Review.findByIdAndDelete(id);
    // Delete image from Cloudinary
    if (review.image.filename) {
        await cloudinary.uploader.destroy(review.image.filename);
    }
    req.flash('deleteReview', "Review successfully deleted.");
    res.redirect('/reviews');
}