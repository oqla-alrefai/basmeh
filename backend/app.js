const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/userRoutes');
const productRoutes = require("./routes/productRoutes")
const cartRoutes = require("./routes/cart")
require("dotenv").config()
const app = express();

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/product', productRoutes)
app.use('/cart', cartRoutes); 


mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    app.listen(process.env.PORT, () => {
      console.log(`serer is running ${process.env.PORT}`);
    })
  })
  .catch(error => console.error('Error connecting to MongoDB:', error));

