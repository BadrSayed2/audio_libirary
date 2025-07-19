const audio_validator = (req,res,next)=>{
    if(req.files['audio'] ){
        return res.status(401).json({err : "you must send an audio file"})
    }
    next();
}

export default audio_validator