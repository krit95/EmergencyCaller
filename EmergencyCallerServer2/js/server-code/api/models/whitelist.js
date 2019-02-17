const mongoose = require('mongoose');

const whitelistSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    phone_no: { type: mongoose.Schema.Types.String, require: true },
    token: { type: mongoose.Schema.Types.String, require: true },
    whitelist: {type: [mongoose.Schema.Types.String]}
});

module.exports = mongoose.model('Whitelist', whitelistSchema);