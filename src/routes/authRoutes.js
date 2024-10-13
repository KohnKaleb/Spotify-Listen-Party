const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/login', authController.login);
router.get('/refresh_access_token', authController.refreshAccessToken);
router.get('/listen', authController.listen);

module.exports = router;