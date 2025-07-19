const express = require('express');
const profile_controller = require('../controllers/profile.controller');
const authenticate = require('../middlewares/authenticate.middleware');
const profile_router = express.Router();
const {header, body} = require('express-validator')
const {profile_upload} = require('../config/multer.config')
const multer = require('multer')
profile_router.use(header('authentication').escape())

profile_router.use(authenticate)

profile_router.get('/',profile_controller.get_profile)

profile_router.put('/',
    profile_upload.single('profile_pic'),
    body('name').optional().escape(),
    profile_controller.update_profile
)


module.exports = profile_router