const { body, validationResult } = require('express-validator');

const run_validation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: "Validation failed", errors: errors.array() });
    }
    next();
};

const register_validation = [
    body('name').notEmpty().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .matches(/[\d!@#$%^&*()_+{}\[\]:;"'<>,.?/\\|~-]/).withMessage('Password must include a number or special character'),
    body('role').optional().isIn(['user', 'admin']).withMessage('Invalid role')
];

const login_validation = [
    body('email').escape(),
    body('password').escape()
];


module.exports = { register_validation, login_validation,run_validation };
