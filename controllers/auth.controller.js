const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const { matchedData } = require('express-validator');
const jwt = require('jsonwebtoken');
// const redis_client = require('../config/redis.config');
// const { info_logger } = require('../utils/logger.util');


const register = async (req, res, next) => {
    try {
        const { name, email, password } = matchedData(req);

        const existing_user = await User.findOne({ email });
        if (existing_user) {
            return res.status(400).json({ success: false, message: "Email already registered" });
        }

        const hashed_password = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashed_password,
            profile_pic: req.file ? req?.file?.filename : undefined
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
        });

    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = matchedData(req);
        console.log(email , password);
        
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const is_match = await bcrypt.compare(password, user.password);

        if (!is_match) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token
        });

    } catch (err) {
        next(err);
    }
};


// const serve_data = async (req,res)=>{
//     const cached_data = await redis_client.get('big_data')
//     if(cached_data){
//         info_logger.info("cache hit")
//         return res.json( {data : JSON.parse(cached_data) } )
//     }
//     info_logger.info("cache miss")
//     const response= await fetch('https://jsonplaceholder.typicode.com/photos')
//     const data = await response.json()
    
//     redis_client.set('big_data' , JSON.stringify(data))
//     res.json({data})
// }

module.exports = { register, login };
