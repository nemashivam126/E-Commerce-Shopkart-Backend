const { default: mongoose } = require("mongoose");

const adminSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: [true, "fname is a required field"]
    },
    lname: {
        type: String,
        required: [true, "lname is a required field"]
    },
    contactNumber: {
        type: String,
        required: [true, "contactNumber is a required field"]
    },
    email: {
        type: String,
        required: [true, "email is a required field"]
    },
    password: {
        type: String,
        required: [true, "password is a required field"]
    },
    gender: {
        type: String,
        required: [true, "gender is a required field"]
    },
    image: {
        type: String,
        required: false
    },
    isAdmin: {
        type: Boolean,
        default: true,
    }
})

module.exports = mongoose.model('Admin', adminSchema);