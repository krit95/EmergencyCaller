const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    category_name: { type: mongoose.Schema.Types.String, require: true },
    is_active: { type: mongoose.Schema.Types.Boolean, require: true, default: true}
});

module.exports = mongoose.model('Category_SLTFR', categorySchema);