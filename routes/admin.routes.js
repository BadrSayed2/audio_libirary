const router = require('express').Router();
const { auth_middleware } = require('../middlewares/auth.middleware');
const { admin_middleware } = require('../middlewares/admin.middleware');
const { get_all_audios, delete_audio_by_admin } = require('../controllers/admin.controller');
const { validate_id, run_validation } = require('../middlewares/validation.middleware');

router.get('/audios', auth_middleware, admin_middleware, get_all_audios);

router.delete('/audio/:id', auth_middleware, admin_middleware, validate_id, run_validation, delete_audio_by_admin);

module.exports = router;
