// Important to chain on .v2 !
const cloudinary = require('cloudinary').v2;
// Specify multer-storage-cloudinary as our CloudinaryStorage
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Associates our account with this instance of Cloudinary
cloudinary.config({
    // Pass whatever we named Cloudinary cloud name in .env file
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    // Pass whatever we named Cloudinary key in .env file
    api_key: process.env.CLOUDINARY_KEY,
    // Pass whatever we named Cloudinary secret in .env file
    api_secret: process.env.CLOUDINARY_SECRET
});

// Create instance of CloudinaryStorage
const storage = new CloudinaryStorage({
    // Pass in cloudinary object we just configured above
    cloudinary,
    params: {
        // Specify the folder on Cloudinary that we should store things in
        folder: 'BitesizedBookReviews',
        // Specify allowed file formats for our images
        allowedFormats: ['gif', 'jpeg', 'jpg', 'png']
    }
});

// Export cloudinary with config above
// Export cloudinary storage with settings above
module.exports = {
    cloudinary,
    storage
}