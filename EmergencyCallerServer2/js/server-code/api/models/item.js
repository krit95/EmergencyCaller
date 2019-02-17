const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    phone_no: { type: String, required: true }
});

module.exports = mongoose.model('Item', itemSchema);