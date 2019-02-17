const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    item_name: { type: String, required: true },
    pack_sizes: { type: [mongoose.Schema.Types.String] },
    price: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category_SLTFR', require: true },
    is_active: { type: mongoose.Schema.Types.Boolean, require: true, default: true },
    description: { type: String}
});

module.exports = mongoose.model('Item_SLTFR', itemSchema);