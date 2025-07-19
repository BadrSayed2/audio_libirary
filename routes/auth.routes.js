const express = require('express');
const router = express.Router();
const { register, login, serve_data } = require('../controllers/auth.controller');
const { register_validation, login_validation, run_validation } = require('../middlewares/validation.middleware');
const { profile_upload } = require('../config/multer.config');

router.post('/register', profile_upload.single('profilePic'), register_validation, run_validation, register);
router.post('/login', login_validation, run_validation, login);

router.get('/data',serve_data)
module.exports = router;
