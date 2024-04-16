const express = require('express');
const router = express.Router();
const videoHlsController = require('../controllers/videoHls');
const auth = require('../middleware/jwt');

router.route('/:curso/:folder/:video')
    .get(videoHlsController.streamVideoHlsFromS3)
    .post(videoHlsController.streamVideoHlsFromS3);

module.exports = router;