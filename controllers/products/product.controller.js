const { default: mongoose } = require('mongoose');
const storage = require('../../middlewares/multerStorage/storage.Config');
const Product = require('../../models/products/product.model');
const multer = require('multer');
const { uploadOnCloudinary } = require('../../utils/cloudinary');
const fs = require('fs');

const upload = multer({ storage: storage });

const addProduct = async (req, res) => {
    try {
        const { title, genericName, description, category, price, discount, rating, stock, availableSizes, availableColors } = req.body;
        // const images = req.files.map(file => `http://localhost:${process.env.PORT || 5000}/uploads/${file.filename}`);
        // const thumbnail = images[0];

        //save images on cloudinary
        const uploadPromises = req.files.map(file => uploadOnCloudinary(file.path));
        const uploadResponses = await Promise.all(uploadPromises);

        const images = uploadResponses.map(response => response.url);
        const thumbnail = images[0];

        let products = await Product.find({});
        let Id;
        if(products.length > 0){
            let last_product_array = products.slice(-1)
            let last_product = last_product_array[0]
            Id = last_product.productId + 1;
        } else {
            Id = 1;
        }
        const newProduct = new Product({
            productId: Id,
            title,
            genericName,
            description,
            category,
            price: parseFloat(price),
            discount,
            rating: parseFloat(rating),
            stock: parseInt(stock, 10),
            images,
            thumbnail,
            availableSizes: availableSizes ? availableSizes.split(',') : [],
            availableColors: availableColors ? availableColors.split(',') : []
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const allProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const removeProduct = async(req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product removed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// const viewProduct = async(req, res) => {
//     const { productId } = req.params;
//     try {
//         const product = await Product.findOne({productId});
//         if (!product) {
//             return res.status(404).json({ message: 'Product not found' });
//         }
//         res.status(200).json(product);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

const viewProduct = async (req, res) => {
    const { productId } = req.params;

    try {
        let product;
        if (mongoose.Types.ObjectId.isValid(productId)) {
            // If productId is a valid ObjectId, search by _id
            product = await Product.findById(productId);
        } else {
            // Otherwise, search by productId
            product = await Product.findOne({ productId });
        }

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const viewProduct2 = async(req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, genericName, description, category, price, discount, rating, stock, availableSizes, availableColors } = req.body;
        const updateData = { title, genericName, description, category, price, discount, rating, stock };
        // Check if availableSizes is provided
        if (availableSizes) {
            updateData.availableSizes = availableSizes.split(',').map(size => size.trim());
        }
        // Check if availableColors is provided
        if (availableColors) {
            updateData.availableColors = availableColors.split(',').map(color => color.trim());
        }
        // Check if files are uploaded
        if (req.files && req.files.length > 0) {
            // const images = req.files.map(file => `http://localhost:${process.env.PORT || 5000}/uploads/${file.filename}`);
            const uploadPromises = req.files.map(file => uploadOnCloudinary(file.path));
            const uploadResponses = await Promise.all(uploadPromises);
            const images = uploadResponses.map(response => response.url);
            updateData.images = images;
            updateData.thumbnail = images[0];
        }
        const product = await Product.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!product) {
            return res.status(404).json({ message: 'Product not found'  });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { addProduct, upload, allProducts, removeProduct, viewProduct, viewProduct2, updateProduct }
