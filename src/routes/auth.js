const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const auth = require('../middleware/jwt');

router.route('/logIn')
    .post(authController.logIn);

router.route('/verifyToken')
    .get(authController.verifyToken);

module.exports = router;