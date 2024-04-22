const express = require('express');
const router = express.Router();
const greetingController = require('../controllers/greeting');
const auth = require('../middleware/jwt');

/* router.route('/')
    .get(auth, greetingController.greeting)
    .post(auth, greetingController.greeting); */

router.route('/')
    .get(auth,greetingController.greeting)
    .post(greetingController.greeting);

module.exports = router;