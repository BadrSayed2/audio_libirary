const mongoose = require('mongoose');

const user_schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    profilePic: {
        type: String
    }
}, { timestamps: true });

const User = mongoose.model('User', user_schema);

module.exports = User;
