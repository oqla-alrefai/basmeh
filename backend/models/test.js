const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    data: Buffer,
    contentType: String
});

const Prod = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    images: [ImageSchema],
    price: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Prod', Prod);
