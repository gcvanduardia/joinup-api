const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const auth = require('../middleware/jwt');

router.route('/logIn')
    .get(authController.logIn);

module.exports = router;