const mongoose = require('mongoose');

//only store admin details
const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_email: { type: mongoose.Schema.Types.String, require: true },
    user_id_token: { type: mongoose.Schema.Types.String, require: true },
    is_active: { type: mongoose.Schema.Types.Boolean, require: true, default: false},
    session_expiry_time: mongoose.Schema.Types.Number,
    company: { type: mongoose.Schema.Types.String, require: true },
});

module.exports = mongoose.model('User', userSchema);