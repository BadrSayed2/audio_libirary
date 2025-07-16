const multer = require('multer')

const create_disk_storage = (destination)=>{
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, destination);
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname);
        }
    });
    
    const upload = multer({ storage  });

    return upload;
}

const cover_upload = create_disk_storage('/uploads/covers')
const profile_upload = create_disk_storage('/uploads/profiles')
const audio_upload = create_disk_storage('/uploads/audio')

module.exports = {cover_upload , profile_upload , audio_upload}