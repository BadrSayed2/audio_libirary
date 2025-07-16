const { matchedData, validationResult } = require("express-validator")
const user_model = require("../models/user.model")

const fs = require('fs')

const profile_controller = {}


profile_controller.get_profile = async (req,res,next)=>{
    try{

        const user_id = req.user_id
        const user = await user_model.findById(user_id).select("-_id -password")
        if(!user){
            return res.status(404).json({err : "user not found"})
        }
        
        res.json({success : true  , user})
    }catch(e){
        next(e)
    }
}

profile_controller.update_profile = async(req,res,next) =>{
    try{
        const user_id = req.user_id
        const errs = validationResult(req)
        if(errs){
            return res.status(401).json({err : errs})
        }
        const new_user = matchedData(req)
        const found_user = user_model.findById(user_id);
        if(!found_user){
            return res.status(404).json({err : "user not found"})
        }
        if(new_user?.name){
            found_user.name = new_user.name
        }
        if(new_user?.profile_pic && found_user?.profile_pic){
            await fs.unlink('../uploads/profiles/'+found_user?.profile_pic)
            found_user.profile_pic = req.file.filename
        }
        found_user.save()
        res.json({message: "user updated successfully"})
    }catch(e){
        next(e)
    }
}

module.exports = profile_controller