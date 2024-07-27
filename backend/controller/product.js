const Product = require("../models/product");

exports.createProduct = async (req, res) => {
  try {
    // Check if the user is admin
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "You are not authorized to create a product" });
    }
    const { name, description, price } = req.body;
    const images = req.files.map((file) => ({
      data: file.buffer,
      contentType: file.mimetype,
    }));
    const product = await Product.create({ name, description, price, images });
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error.message)
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, description, price } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the user is admin
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this product" });
    }
    if (name) {
      product.name = name;
    }
    if (description) {
      product.description = description;
    }
    if (price) {
      product.price = price;
    }

    await product.save();

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const { name } = req.params;

    // Search for products by name or description
    const products = await Product.find({
      $or: [
        { name: { $regex: name, $options: "i" } }, // Case-insensitive search for name
        { description: { $regex: name, $options: "i" } }, // Case-insensitive search for description
      ],
    });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addDiscount = async (req, res) => {
  try {
    const { productId } = req.params;
    const { percentage, startTime, endTime } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the user is admin
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "You are not authorized to add a discount" });
    }

    product.discount = { percentage, startTime, endTime };
    await product.save();

    res.status(200).json({ message: "Discount added successfully", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeDiscount = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the user is admin
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "You are not authorized to remove a discount" });
    }

    product.discount = undefined;
    await product.save();

    res.status(200).json({ message: "Discount removed successfully", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    const currentTime = new Date();
    products.forEach((product) => {
      if (
        product.discount &&
        currentTime >= product.discount.startTime &&
        currentTime <= product.discount.endTime
      ) {
        product.price = product.price * (1 - product.discount.percentage / 100);
      }
    });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
