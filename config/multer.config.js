const multer = require('multer')

const create_disk_storage = (destination,type)=>{
    
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, destination);
        },
        filename: function (req, file, cb) {
            
            cb(null, Date.now() + '-' + file.originalname);
        }
    });
    let limits;
    if(type =='profile'){
        limits = {fileSize : 2000 * 1024 * 1024}
    }else if(type =='audio'){
        limits = {fileSize : 50 * 1024 * 1024}
    }
    const upload = multer({ storage  ,limits });

    return upload;
}

// const cover_upload = create_disk_storage('./uploads/covers')
const profile_upload = create_disk_storage('./uploads/profiles' , 'profile')
const audio_upload = create_disk_storage('./uploads/audios','audio')

module.exports = { profile_upload , audio_upload}