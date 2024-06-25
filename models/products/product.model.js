const mongoose = require('mongoose');

const productShema = new mongoose.Schema({
    productId: {
        type: Number,
        required: false,
    },
    title: { 
        type: String, 
        required: true 
    },
    genericName: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    category: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    discount: { 
        type: String, 
        required: false,
        default: '0'
    },
    rating: { 
        type: Number, 
        required: true 
    },
    stock: { 
        type: Number, 
        required: true 
    },
    images: { 
        type: [String], 
        required: true  
    },
    thumbnail: { 
        type: String, 
        required: false 
    },
    availableSizes: {
        type: [String],
        required: false,
        default: []
    },
    availableColors: {
        type: [String],
        required: false,
        default: []
    }
})

module.exports = mongoose.model('Product', productShema);