const { matchedData, validationResult } = require("express-validator")
const user_model = require("../models/user.model")

const fs = require('fs')

const profile_controller = {}


profile_controller.get_profile = async (req,res,next)=>{
    try{

        const user_id = req.user_id
        const user = await user_model.findById(user_id).select("-_id -password -__v")
        if(!user){
            return res.status(404).json({err : "user not found"})
        }
        if(user?.profile_pic){
            user.profile_pic = 'http://localhost:4000/uploads/profiles/' + user.profile_pic
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
        
        if(errs?.length > 0){
            return res.status(401).json({err : errs.array()})
        }
        const new_user = matchedData(req)
        console.log(req.file.filename);
        
        
        const found_user = await user_model.findById(user_id);
        
        
        if(!found_user){
            return res.status(404).json({err : "user not found"})
        }
        
        console.log(req?.body?.name);
        
        if(req?.body?.name){
            found_user.name = req?.body?.name
        }
        
        if(req.file && found_user?.profile_pic){
            
            await fs.unlink('./uploads/profiles/'+found_user?.profile_pic,(err)=>{
                if(err){
                    console.log(err);
                    res.status(401).json({err:"couldn't update your profile"})
                    
                }
            })
        }
        found_user.profile_pic = req?.file?.filename
        // console.log(found_user);
        
        found_user.save()
        res.json({message: "user updated successfully"})
    }catch(e){
        console.log(e.message);
        // console.log(2);
        
        res.json({err : "something went wrong"})
        // next(e)
    }
}

module.exports = profile_controller