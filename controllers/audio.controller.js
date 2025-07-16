const Audio = require('../models/audio.model');
const fs = require('fs');
const path = require('path');

const upload_audio = async (req, res, next) => {
    try {
        const { title, genre, isPrivate } = req.body;
        const audioFile = req.files['audio']?.[0];
        const coverFile = req.files['cover']?.[0];

        if (!audioFile) {
            return res.status(400).json({ success: false, message: 'Audio file is required' });
        }

        const audio = await Audio.create({
            title,
            genre,
            isPrivate,
            audioPath: audioFile.path,
            coverPath: coverFile?.path,
            user: req.user._id
        });

        res.status(201).json({ success: true, data: audio });

    } catch (err) {
        next(err);
    }
};

const list_my_audios = async (req, res, next) => {
    try {
        const audios = await Audio.find({ user: req.user._id });
        res.json({ success: true, data: audios });
    } catch (err) {
        next(err);
    }
};

const stream_audio = async (req, res, next) => {
    try {
        const audio = await Audio.findById(req.params.id);
        if (!audio) return res.status(404).json({ success: false, message: 'Audio not found' });

        if (audio.isPrivate && !audio.user.equals(req.user._id)) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        const audioPath = path.resolve(audio.audioPath);
        if (!fs.existsSync(audioPath)) {
            return res.status(404).json({ success: false, message: 'Audio file missing on server' });
        }

        const stat = fs.statSync(audioPath);
        const total = stat.size;
        const range = req.headers.range;

        if (range) {
            const parts = range.replace(/bytes=/, '').split('-');
            const partialstart = parts[0];
            const partialend = parts[1];

            const start = parseInt(partialstart, 10);
            const end = partialend ? parseInt(partialend, 10) : total - 1;
            const chunksize = (end - start) + 1;

            const file = fs.createReadStream(audioPath, { start, end });
            res.writeHead(206, {
                'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'audio/mpeg'
            });
            file.pipe(res);

        } else {
            res.writeHead(200, {
                'Content-Length': total,
                'Content-Type': 'audio/mpeg'
            });
            fs.createReadStream(audioPath).pipe(res);
        }

    } catch (err) {
        next(err);
    }
};

const update_audio = async (req, res, next) => {
    try {
        const audio = await Audio.findById(req.params.id);
        if (!audio) return res.status(404).json({ success: false, message: 'Audio not found' });

        if (!audio.user.equals(req.user._id)) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        const { title, genre, isPrivate } = req.body;

        if (title) audio.title = title;
        if (genre) audio.genre = genre;
        if (isPrivate !== undefined) audio.isPrivate = isPrivate;

        if (req.files?.['cover']?.[0]) {
            if (audio.coverPath && fs.existsSync(audio.coverPath)) {
                fs.unlinkSync(audio.coverPath);
            }
            audio.coverPath = req.files['cover'][0].path;
        }

        await audio.save();

        res.json({ success: true, data: audio });

    } catch (err) {
        next(err);
    }
};

const delete_audio = async (req, res, next) => {
    try {
        const audio = await Audio.findById(req.params.id);
        if (!audio) return res.status(404).json({ success: false, message: 'Audio not found' });

        if (!audio.user.equals(req.user._id)) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        if (fs.existsSync(audio.audioPath)) fs.unlinkSync(audio.audioPath);
        if (audio.coverPath && fs.existsSync(audio.coverPath)) fs.unlinkSync(audio.coverPath);

        await audio.deleteOne();

        res.json({ success: true, message: 'Audio deleted successfully' });

    } catch (err) {
        next(err);
    }
};

module.exports = { upload_audio, list_my_audios, stream_audio, update_audio, delete_audio };
