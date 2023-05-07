// Node Packages
const express = require('express');
// Create Express Router
// { mergeParams: true } ensures req.params is populated (in this file) with the id we get from the path "/reviews/:id" in app.js
// NOTE: No need to specify mergeParams in reviews.js router file because the id's are already included in the paths there
const router = express.Router({ mergeParams: true });
// Mongoose Models
const Review = require('../models/review');
const Comment = require('../models/comment');
// Controllers
const comments = require('../controllers/comments');
// Error Handling Utilities
const wrapAsync = require('../utilities/wrapAsync');
// Middleware Imports
const { isLoggedIn, isCommentAuthor, validateComment } = require('../middleware');

//*******************************************************************//
//************************ COMMENTS ROUTES ************************//
//*******************************************************************//

// NEW COMMENT
router.post('/', isLoggedIn, validateComment, wrapAsync(comments.createComment));

// DELETE COMMENT
router.delete('/:commentId', isLoggedIn, isCommentAuthor, wrapAsync(comments.deleteComment));

// Export Router
module.exports = router;