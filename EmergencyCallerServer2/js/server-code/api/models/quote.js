const mongoose = require('mongoose');

const quoteSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    quote: { type: String, required: true },
});

module.exports = mongoose.model('Quote', quoteSchema);