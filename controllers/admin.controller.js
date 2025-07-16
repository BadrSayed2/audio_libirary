const Audio = require('../models/audio.model');
const fs = require('fs');

const get_all_audios = async (req, res, next) => {
    try {
        const audios = await Audio.find().populate('user', 'name email');
        res.json({ success: true, data: audios });
    } catch (err) {
        next(err);
    }
};

const delete_audio_by_admin = async (req, res, next) => {
    try {
        const audio = await Audio.findById(req.params.id);
        if (!audio) return res.status(404).json({ success: false, message: 'Audio not found' });

        if (fs.existsSync(audio.audioPath)) fs.unlinkSync(audio.audioPath);
        if (audio.coverPath && fs.existsSync(audio.coverPath)) fs.unlinkSync(audio.coverPath);

        await audio.deleteOne();

        res.json({ success: true, message: 'Audio deleted by admin successfully' });

    } catch (err) {
        next(err);
    }
};

module.exports = { get_all_audios, delete_audio_by_admin };
