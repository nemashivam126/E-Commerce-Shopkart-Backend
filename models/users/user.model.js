const { default: mongoose } = require("mongoose");

const cartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    productSize: {
        type: String,
        required: false
    },
    productColor: {
        type: String,
        required: false
    },
    productPrice: {
        type: Number,
        required: true
    },
});

const addressSchema = new mongoose.Schema({
    label: {
        type: String,
        required: [true, "Label is a required field"]
    },
    houseNo: {
        type: String,
        required: [true, "House number is a required field"]
    },
    street: {
        type: String,
        required: [true, "Street is a required field"]
    },
    landmark: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: [true, "City is a required field"]
    },
    state: {
        type: String,
        required: [true, "State is a required field"]
    },
    pincode: {
        type: String,
        required: [true, "Pincode is a required field"]
    },
    country: {
        type: String,
        required: [true, "Country is a required field"]
    }
});

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    productSize: {
        type: String,
        required: false
    },
    productColor: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: true,
        default: 'idle'
    },
    amount: {
        type: Number,
        required: true
    },
    estimatedDate: {
        type: Date,
        default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // default to 7 days from now
    }
});

const orderSchema = new mongoose.Schema({
    items: [orderItemSchema],
    totalAmount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    address: addressSchema
});

const userSchema = new mongoose.Schema({
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
    cart: [cartItemSchema],
    addresses: [addressSchema],
    selectedAddress: addressSchema,
    orders: [orderSchema],
    isAdmin: {
        type: Boolean,
        default: false,
    }
})

module.exports = mongoose.model('User', userSchema);