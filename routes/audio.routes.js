const { body, param } = require('express-validator');
const mongoose = require('mongoose');
const express = require('express');
const authenticate = require('../middlewares/authenticate.middleware');
const audio_controller = require('../controllers/audio.controller');
const { audio_upload } = require('../config/multer.config');
const {header} = require('express-validator');
const { run_validation } = require('../middlewares/validation.middleware');
const audio_validation = [
    body('title').escape().notEmpty().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
    body('genre').escape().isIn(['education', 'religion', 'comedy', 'fiction', 'self-help']).withMessage('Invalid genre'),
    body('isPrivate').optional().isBoolean().withMessage('isPrivate must be boolean')
];


const audio_router = express.Router()

audio_router.use(header('authentication').escape())

audio_router.use(authenticate)

audio_router.post('/',
  audio_upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'cover', maxCount: 1 }
  ]),
  // multer().any(),
  audio_validation,
  run_validation,
  audio_controller.upload_audio)
  
  audio_router.get('/',audio_controller.get_public_audios)
  
  audio_router.get('/mine',audio_controller.list_my_audios)
  
  const validate_id = param('audio_id').notEmpty().escape().custom(value => mongoose.Types.ObjectId.isValid(value)).withMessage('Invalid ID');

  audio_router.delete('/:audio_id',validate_id,run_validation,audio_controller.delete_audio)

module.exports = audio_router;
