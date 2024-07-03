const { default: mongoose } = require("mongoose");
const AdminOrder = require("../../models/adminOrders/adminOrders.model");

const createOrder = async (req, res) => {
    try {
        const { userId, items, totalAmount, address } = req.body;

        if (!mongoose.Types.ObjectId.isValid(address)) {
            return res.status(400).json({ error: 'Invalid address ID' });
        }

        const newOrder = new AdminOrder({
            userId,
            items,
            totalAmount,
            address
        });

        const savedOrder = await newOrder.save();

        res.status(201).json(savedOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await AdminOrder.find().populate('userId').populate('items.productId');
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// const updateOrderStatus = async (req, res) => {
//     const { orderId } = req.params;
//     const { status } = req.body;

//     try {
//         const updatedOrder = await AdminOrder.findByIdAndUpdate(
//             orderId,
//             { $set: { 'items.$[].status': status } },
//             { new: true }
//         );

//         if (!updatedOrder) {
//             return res.status(404).json({ error: 'Order not found' });
//         }

//         res.status(200).json(updatedOrder);
//     } catch (error) {
//         console.error('Error updating order status:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

const updateOrderStatus = async (req, res) => {
    const { orderId, itemId } = req.params;
    const { status } = req.body;

    try {
        const updatedOrder = await AdminOrder.findOneAndUpdate(
            {
                _id: orderId,
                'items._id': itemId // Match specific item ID within the order
            },
            { $set: { 'items.$.status': status } }, // Update the status of the matched item
            { new: true }
        ).populate('userId').populate('items.productId'); // Ensure to populate related fields if needed

        if (!updatedOrder) {
            return res.status(404).json({ error: 'Order or item not found' });
        }

        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error('Error updating order item status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { getAllOrders, updateOrderStatus, createOrder };