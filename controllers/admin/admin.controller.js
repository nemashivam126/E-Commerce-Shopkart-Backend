require('dotenv').config();
const multer = require('multer');
const jwt = require('jsonwebtoken');
const storage = require('../../middlewares/multerStorage/storage.Config');
const Admin = require('../../models/admin/admin.model');
const { uploadOnCloudinary } = require('../../utils/cloudinary');
const fs = require('fs');


const upload = multer({ storage: storage }).single('image');

const addAdminUser = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        const { fname, lname, contactNumber, email, password, gender } = req.body;

        // Validate required fields
        if (!fname || !lname || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        try {
            const existingAdmin = await Admin.findOne({ email });
            if (existingAdmin) {
                return res.status(400).json({ error: 'This email is already registered. Try entering different email.' });
            }

            //save image on cloudinary
            let imageUrl = null;
            if (req.file) {
                const response = await uploadOnCloudinary(req.file.path);
                if (response && response.url) {
                    imageUrl = response.url;
                    fs.unlinkSync(req.file.path); // Remove the locally saved file
                }
            }

            // Create a new admin object
            const newAdmin = new Admin({
                fname,
                lname,
                contactNumber,
                email,
                password,  // Storing plaintext password
                gender,
                // image: req.file ? `http://localhost:${process.env.PORT || 5000}/uploads/${req.file.filename}` : null,
                image: imageUrl,
                isAdmin: true
            });

            // Save the admin to the database
            await newAdmin.save();
            // const data = {
            //     admin: {
            //         id : newAdmin.id,
            //         email: newAdmin.email,
            //         firstName: newAdmin.fname,
            //         lastName: newAdmin.lname,
            //         avatar: newAdmin.image,
            //         gender: newAdmin.gender,
            //         isAdmin: newAdmin.isAdmin
            //     }
            // }
            // const token = jwt.sign(data, process.env.SECRET_KEY, {expiresIn: '1h'});
            res.status(201).json({ success: true, message: 'Admin Created Successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
};

const signIn = async (req, res) => {
    const admin = await Admin.findOne({email: req.body.email});
    if(admin) {
        const comparePassword = req.body.password === admin.password;
        if(comparePassword) { 
            const data = {
                admin: {
                    id : admin.id,
                    email: admin.email,
                    firstName: admin.fname,
                    lastName: admin.lname,
                    avatar: admin.image,
                    gender: admin.gender,
                    isAdmin: admin.isAdmin
                }
            }
            const token = jwt.sign(data, process.env.SECRET_KEY, {expiresIn: '24h'});
            res.status(200).json({success: true, token, user: data.admin});
        } else {
            res.status(404).json({success: false, message: 'Incorrect password'})
        }
    }
    else {
        res.status(404).json({success: false, message: 'Incorrect email'})
    }
}

module.exports = { addAdminUser, signIn };