require('dotenv').config();
// const storage = require('../../middlewares/multerStorage/storage.Config');
const User = require('../../models/users/user.model');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const { storage } = require('../../utils/cloudinary');
// const { uploadOnCloudinary } = require('../../utils/cloudinary');
// const fs = require('fs');


const upload = multer({ storage: storage }).single('image');

const addUser = async (req, res) => {
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
            // Check if the email is already taken
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: 'This email is already registered. Try entering different email.' });
            }

            // //save image on cloudinary
            // let imageUrl = null;
            // if (req.file) {
            //     const response = await uploadOnCloudinary(req.file.path);
            //     if (response && response.url) {
            //         imageUrl = response.url;
            //         fs.unlinkSync(req.file.path); // Remove the locally saved file
            //     }
            // }

            // Create a new user object
            const newUser = new User({
                fname,
                lname,
                contactNumber,
                email,
                password,  // Storing plaintext password
                gender,
                // image: req.file ? `http://localhost:${process.env.PORT || 5000}/uploads/${req.file.filename}` : null,
                // image: imageUrl,
                image: req.file ? req.file.path : null, // Cloudinary URL
                isAdmin: false
            });

            // Save the user to the database
            await newUser.save();
            const data = {
                user: {
                    id : newUser.id,
                    email: newUser.email,
                    firstName: newUser.fname,
                    lastName: newUser.lname,
                    avatar: newUser.image,
                    gender: newUser.gender,
                    isAdmin: newUser.isAdmin
                }
            }
            const token = jwt.sign(data, process.env.SECRET_KEY, {expiresIn: '24h'});
            res.status(201).json({ success: true, token, user: data.user });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
};

const viewUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const getUsers = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.find({});
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addToCart = async (req, res) => {
    const { id } = req.params;
    const { productId, quantity, productSize, productColor, productPrice } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the product already exists in the cart
        const cartItem = user.cart.find(item => item.productId.toString() === productId);
        if (cartItem) {
            // If the product exists, update the quantity
            cartItem.quantity += quantity;
        } else {
            // If the product does not exist, add a new item to the cart
            user.cart.push({ productId, quantity, productSize, productColor, productPrice });
        }

        await user.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const removeFromCart = async (req, res) => {
    const { id } = req.params; // assuming the id is passed as a parameter
    const { productId } = req.body;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Filter out the product from the cart
        user.cart = user.cart.filter(item => item.productId.toString() !== productId);

        await user.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCartQuantity = async (req, res) => {
    const { id } = req.params;
    const { productId, quantity } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the product in the cart and update its quantity
        const cartItem = user.cart.find(item => item.productId.toString() === productId);
        if (cartItem) {
            cartItem.quantity = quantity;
            if (cartItem.quantity <= 0) {
                // If quantity is zero or less, remove the item from the cart
                user.cart = user.cart.filter(item => item.productId.toString() !== productId);
            }
            await user.save();
            return res.status(200).json(user);
        }

        res.status(404).json({ message: 'Product not found in cart' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const viewUserCart = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user.cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const signIn = async (req, res) => {
    const user = await User.findOne({email: req.body.email});
    if(user) {
        const comparePassword = req.body.password === user.password;
        if(comparePassword) { 
            const data = {
                user: {
                    id : user.id,
                    email: user.email,
                    firstName: user.fname,
                    lastName: user.lname,
                    avatar: user.image,
                    gender: user.gender,
                    isAdmin: user.isAdmin
                }
            }
            const token = jwt.sign(data, process.env.SECRET_KEY, {expiresIn: '24h'});
            res.status(200).json({success: true, token, user: data.user});
        } else {
            res.status(404).json({success: false, message: 'Incorrect password'})
        }
    }
    else {
        res.status(404).json({success: false, message: 'Incorrect email'})
    }
}

const getCartCount = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        const cartCount = user.cart.length
        res.status(200).json(cartCount);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const addAddress = async (req, res) => {
    const { id } = req.params;
    const { label, houseNo, street, landmark, city, state, pincode, country } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Add the new address to the user's addresses array
        user.addresses.push({ label, houseNo, street, landmark, city, state, pincode, country });

        await user.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateAddress = async (req, res) => {
    const { userId, addressId } = req.params;
    const { label, houseNo, street, landmark, city, state, pincode, country } = req.body;
  
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
    
        const addressToUpdate = user.addresses.id(addressId);
        if (!addressToUpdate) {
            return res.status(404).json({ message: 'Address not found' });
        }
    
        addressToUpdate.label = label;
        addressToUpdate.houseNo = houseNo;
        addressToUpdate.street = street;
        addressToUpdate.landmark = landmark;
        addressToUpdate.city = city;
        addressToUpdate.state = state;
        addressToUpdate.pincode = pincode;
        addressToUpdate.country = country;
    
        await user.save();
    
        res.status(200).json({ message: 'Address updated successfully', address: addressToUpdate });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};
  
// Delete an address for a user
const deleteAddress = async (req, res) => {
    const { userId, addressId } = req.params;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.addresses.pull(addressId);
        await user.save();
        res.status(200).json({ message: 'Address deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
  
// Get all addresses for a user
const getAddresses = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
        return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user.addresses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const setSelectedAddress = async (req, res) => {
    const { id, addressId } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const addressExists = user.addresses.id(addressId);
        if (!addressExists) {
            return res.status(404).json({ message: 'Address not found' });
        }
        user.selectedAddress = addressExists;
        await user.save();
        res.status(200).json({ message: 'Selected address updated successfully', selectedAddress: addressExists });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const setUserOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { items, totalAmount, address } = req.body;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.orders.push({ items, totalAmount, address });
        user.cart = [];

        await user.save();

        res.status(200).json({ message: 'Order placed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const emptyCart = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.cart = [];
        await user.save();

        res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const viewUserOrders = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user.orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getOrderItemById = async (req, res) => {
    try {
      const { orderItemId } = req.params;
      const user = await User.findOne({ 'orders.items._id': orderItemId }, { 'orders.$': 1 }).populate('orders.items.productId');
  
      if (!user) {
        return res.status(404).json({ message: 'Order item not found' });
      }
  
      const order = user.orders.find(order => 
        order.items.some(item => item._id.toString() === orderItemId)
      );
  
      if (!order) {
        return res.status(404).json({ message: 'Order item not found' });
      }
  
      const orderItem = order.items.find(item => item._id.toString() === orderItemId);
  
      res.status(200).json(orderItem);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };

// const getOrderItemById = async(req, res) => {
//     const { id } = req.params;
//     try {
//         const user = await User.findById(id);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         res.status(200).json(user.orders);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// }

const getAllUsersOrders = async (req, res) => {
    try {
        // Find users who have orders
        const usersWithOrders = await User.find({ orders: { $exists: true, $not: { $size: 0 } } }).populate({
            path: 'orders.items.productId',
            model: 'Product'  // Assuming 'Product' is your product model name
        }).exec();

        res.status(200).json(usersWithOrders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getAllUserOrders = async (req, res) => {
    const { id } = req.params; // Assuming userId is passed as a parameter
    
    try {
        // Find the user by their ID and populate their orders
        const user = await User.findById(id).populate({
            path: 'orders.items.productId',
            model: 'Product' // Assuming 'Product' is your product model name
        }).exec();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return only the user's orders
        res.status(200).json(user.orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateOrderItemStatus = async (req, res) => {
    const { userId, itemId } = req.params;
    const { status, estimatedDate } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const order = user.orders.find(order => order.items.some(item => item._id.toString() === itemId));

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const orderItem = order.items.find(item => item._id.toString() === itemId);

        if (!orderItem) {
            return res.status(404).json({ message: 'Order item not found' });
        }

        orderItem.status = status;

        if (estimatedDate) {
            orderItem.estimatedDate = new Date(estimatedDate);
        }

        await user.save();

        res.json(orderItem);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const buyNow = async (req, res) => {
    const { id } = req.params; // user ID
    const { productId, quantity, productSize, productColor, amount, address } = req.body;

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create a new order with the product
        const newOrder = {
            items: [{ productId, quantity, productSize, productColor, amount, status: 'Pending' }],
            totalAmount: amount * quantity,
            address,
        };

        user.orders.push(newOrder);
        await user.save();

        res.status(200).json({ message: 'Order placed successfully', order: newOrder });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = { addUser, viewUser, getUsers, addToCart, removeFromCart, updateCartQuantity, viewUserCart, signIn, getCartCount, addAddress, updateAddress, deleteAddress, getAddresses, setSelectedAddress, setUserOrder, emptyCart, viewUserOrders, getOrderItemById, getAllUserOrders, getAllUsersOrders, updateOrderItemStatus, buyNow };
