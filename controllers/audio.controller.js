const { matchedData } = require('express-validator');
const Audio = require('../models/audio.model');
const fs = require('fs');
const path = require('path');
const move_file = require('../utils/move_file.utils');

const uploads_dirname_arr = __dirname.split('\\')
uploads_dirname_arr.pop()
const uploads_dirname = path.join(...uploads_dirname_arr)

const upload_audio = async (req, res, next) => {
    try {
        const { title, genre, is_private } = matchedData(req);
        // console.log(2);
        // const { title, genre, is_private } = req.body;
        
        const audioFile = req.files['audio']?.[0];
        const coverFile = req.files['cover']?.[0];

        if (!audioFile) {
            return res.status(400).json({ success: false, message: 'Audio file is required' });
        }
        
        const old_path = path.join(uploads_dirname , 'uploads','audios' , coverFile?.filename??"")
        const new_path = path.join(uploads_dirname , 'uploads' , 'covers' , coverFile?.filename??"")
        
        await move_file(old_path , new_path)
        
        const audio = await Audio.create({
            title,
            genre,
            is_private,
            audioPath: audioFile?.filename,
            coverPath: coverFile?.filename??undefined,
            user: req.user_id
        });
            
        res.status(201).json({ success: true, data: audio });
    } catch (err) {
        next(err);
    }
};

const list_my_audios = async (req, res, next) => {
    try {
        const audios_obj = await Audio.find({ user: req.user_id });
        const audios = audios_obj.map((audio)=>{
            return {
                id : audio._id,
                title : audio.title ,
                genre : audio.genre,
                is_private : audio.isPrivate,
                audioPath : uploads_dirname+"/audios/"+audio.audioPath,
                coverPath : uploads_dirname+"/covers/" + audio.coverPath
            }
        })
        
        res.json({ success: true, data: audios });
    } catch (err) {
        next(err);
    }
};

const get_public_audios = async (req,res,next)=>{
    try{
        const audios_obj = await Audio.find({isPrivate : false})
        const audios = audios_obj.map((audio)=>{
            return {
                id : audio._id,
                title : audio.title ,
                genre : audio.genre,
                is_private : audio.isPrivate,
                audioPath : uploads_dirname+"/audios/"+audio.audioPath,
                coverPath : uploads_dirname+"/covers/" + audio.coverPath
            }
        })
        res.json({data : audios ,success:true})
    }catch(e){
        next(e)
    }

}

const stream_audio = async (req, res, next) => {
    try {
        const audio = await Audio.findById(req.user_id);
        if (!audio) return res.status(404).json({ success: false, message: 'Audio not found' });

        if (audio.is_private && !audio._id == req.user_id) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        const audioPath = path.join(uploads_dirname ,'audios',  audio.audioPath);
        if (!fs.existsSync(audio.audioPath)) {
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

        const { title, genre, is_private } = req.body;

        if (title) audio.title = title;
        if (genre) audio.genre = genre;
        if (is_private !== undefined) audio.is_private = is_private;

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

        const audio = await Audio.findById(req.params.audio_id);
        if (!audio) return res.status(404).json({ success: false, message: 'Audio not found' });

        if (!audio.user.equals(req.user_id)) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }
        const audio_path = path.join(uploads_dirname , 'uploads','audios',audio.audioPath)
        if (fs.existsSync(audio_path)) fs.unlinkSync(audio_path);
        const cover_path = path.join(uploads_dirname , 'uploads','covers',audio.coverPath);
        if (audio.coverPath && fs.existsSync(cover_path)) fs.unlinkSync(cover_path);

        await audio.deleteOne();

        res.json({ success: true, message: 'Audio deleted successfully' });

    } catch (err) {
        next(err);
    }
};

module.exports = { get_public_audios , upload_audio, list_my_audios, stream_audio, update_audio, delete_audio };
