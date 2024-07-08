require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// const uploadOnCloudinary = async (localFilePath) => {
//     try {
//         if (!localFilePath) {
//          return null   
//         }
//         const response = await cloudinary.uploader.upload(localFilePath, {
//             resource_type: 'auto'
//         })
//         console.log("file successfully uploaded on cloudinary", response.url);
//         return response;
//     } catch (error) {
//         fs.unlinkSync(localFilePath) // remove the locally saved temprory file as the upload operation got failed
//         return error;
//     }
// }

// module.exports = { uploadOnCloudinary };

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads',
        // format: async (req, file) => 'png', // supports promises as well
        format: async (req, file) => {
            // Extract the file extension from the original filename
            const ext = file.originalname.split('.').pop().toLowerCase();
            
            // Check if the extension is one of the allowed formats
            const allowedFormats = ['png', 'jpg', 'jpeg', 'webp', 'svg'];
            if (allowedFormats.includes(ext)) {
                return ext; // Return the format if it's allowed
            } else {
                throw new Error('Invalid file format');
            }
        },
        public_id: (req, file) => Date.now() + '-' + file.originalname,
    },
});

module.exports = { cloudinary, storage };