require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./database/dbconfig');
const productRoutes = require('./routes/products/product.route');
const userRoutes = require('./routes/user/user.route');
const adminRoutes = require('./routes/admin/admin.route');
const adminOrderRoutes = require('./routes/adminOrders/adminOrders.route');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

//database connection
connectDB();

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/shopkart', productRoutes);
app.use('/shopkart', userRoutes);
app.use('/shopkart', adminRoutes);
app.use('/shopkart/admin/user-order', adminOrderRoutes);

app.get('/', function (req, res){
    res.send('This is the default route')
})

app.listen(process.env.PORT, () => {
    console.log(`${PORT} connected.`);
});