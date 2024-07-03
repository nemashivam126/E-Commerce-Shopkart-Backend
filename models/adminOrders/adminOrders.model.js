// models/AdminOrder.js
const mongoose = require('mongoose');

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
        default: 'Pending'
    },
    amount: {
        type: Number,
        required: true
    }
});

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [orderItemSchema],
    totalAmount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: true
    }
});

module.exports = mongoose.model('AdminOrder', orderSchema);
