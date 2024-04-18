const express = require('express');
const router = express.Router();
const mp4ToHlsController = require('../controllers/mp4ToHls');
const auth = require('../middleware/jwt');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

router.route('/upload/:curso')
    .post(upload.single('video'),mp4ToHlsController.mp4ToHls);

module.exports = router;