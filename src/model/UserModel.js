const mongoose = require('mongoose');
const DataSchema = mongoose.Schema({

    email: {type: String, unique: true, required: true},
    name: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String, required: true},
    isActive: {type: Boolean, default: false}

}, {timestamps: true, versionKey: false})

const UserModel = mongoose.model('users', DataSchema);
module.exports = UserModel;