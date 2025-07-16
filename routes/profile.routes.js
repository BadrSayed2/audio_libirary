const express = require('express');
const profile_controller = require('../controllers/profile.controller');
const authenticate = require('../middleware/authenticate.middleware');
const profile_router = express.Router();
const {header, body} = require('express-validator')
profile_router.use(header('authentication').escape())
profile_router.use(authenticate)

profile_router.get('/',profile_controller.get_profile)

profile_router.put('/',
    body('name').optional().isLength({min : 2}),
    profile_upload.single('profile_pic'),
    profile_controller.update_profile
)


    /**
     * {
  originalname: 'photo.jpg',
  filename: '1719248855532-photo.jpg',
  path: 'uploads/1719248855532-photo.jpg',
  size: 204800,
  mimetype: 'image/jpeg'
}
     */
module.exports = profile_router