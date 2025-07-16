const mongoose = require('mongoose');

const audioSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3
    },
    genre: {
        type: String,
        required: true,
        enum: ['education', 'religion', 'comedy', 'fiction', 'self-help']
    },
    isPrivate: {
        type: Boolean,
        default: false
    },
    audioPath: {
        type: String,
        required: true
    },
    coverPath: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

const Audio = mongoose.model('Audio', audioSchema);

module.exports = Audio;
