const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema({
  percentage: {
    type: Number,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
});

const ImageSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  images: [ImageSchema],
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  categories: [{
    type: String,
    required: true
  }],
  discount: discountSchema,
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
