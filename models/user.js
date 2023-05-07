const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

// Will automatically add on a username, a hash of password, and salt field 
// Makes sure usernames are unique
// Gives us some additional methods we can use too, e.g. authenticate()
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);