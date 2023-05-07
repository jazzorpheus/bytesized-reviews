// Mongoose Models
const Review = require('../models/review');
const Comment = require('../models/comment');

//***********************************************//
//*************** COMMENTS CONTROLLERS ***************//
//***********************************************//

// NEW COMMENT
module.exports.createComment = async (req, res) => {
    const { id } = req.params;
    const review = await Review.findById(id);
    const comment = new Comment(req.body.comment);
    comment.user = req.user._id;
    review.comments.unshift(comment);
    await review.save();
    await comment.save();
    req.flash('newComment', "Successfully posted comment!");
    res.redirect(`/reviews/${id}`);
}

// DELETE COMMENT
module.exports.deleteComment = async (req, res) => {
    const { id, commentId } = req.params;
    await Review.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    req.flash('deleteComment', "Successfully deleted comment.");
    res.redirect(`/reviews/${id}`);
}