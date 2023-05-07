const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Necessary for our delete middleware
const Comment = require('./comment');

const reviewSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    image: {
        url: String,
        filename: String
    },
    rating: {
        type: Number,
        required: true
    },
    heading: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
});

// Mongoose *query* middleware that runs every time AFTER ('post') deleting a single review
// Deletes all comments tied to a review
// NOTE: 'doc' is the deleted review
reviewSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Comment.deleteMany({
            _id: {
                $in: doc.comments
            }
        });
    }
});

module.exports = mongoose.model('Review', reviewSchema); 