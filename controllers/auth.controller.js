const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        const existing_user = await User.findOne({ email });
        if (existing_user) {
            return res.status(400).json({ success: false, message: "Email already registered" });
        }

        const hashed_password = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashed_password,
            role,
            profilePic: req.file ? req.file.path : undefined
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profilePic: user.profilePic
            }
        });

    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

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

module.exports = { register, login };
