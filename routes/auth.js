const express = require('express');
const router = express.Router();
const { login, register, getMe, getProfile, updateProfile } = require('../controllers/authController');

router.post('/login', login);
router.post('/register', register);
router.get('/me', getMe);
router.get('/profile', getProfile);
router.patch('/profile', updateProfile);

module.exports = router;
