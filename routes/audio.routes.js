const { body, param } = require('express-validator');
const mongoose = require('mongoose');

const audio_validation = [
    body('title').notEmpty().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
    body('genre').isIn(['education', 'religion', 'comedy', 'fiction', 'self-help']).withMessage('Invalid genre'),
    body('isPrivate').optional().isBoolean().withMessage('isPrivate must be boolean')
];

const audio_update_validation = [
    body('title').optional().isLength({ min: 3 }),
    body('genre').optional().isIn(['education', 'religion', 'comedy', 'fiction', 'self-help']),
    body('isPrivate').optional().isBoolean()
];

const validate_id = param('id').custom(value => mongoose.Types.ObjectId.isValid(value)).withMessage('Invalid ID');

module.exports = {
    ...module.exports,
    audio_validation,
    audio_update_validation,
    validate_id
};
