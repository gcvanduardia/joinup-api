const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const auth = require('../middleware/jwt');

router.route('/historialCursos')
    .post(auth, userController.historialCursos);

router.route('/dataIni')
    .post(auth, userController.dataIni);   

module.exports = router;