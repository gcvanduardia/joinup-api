const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const auth = require('../middleware/jwt');

router.route('/historialCursos')
    .get(auth, userController.historialCursos);

router.route('/dataIni')
    .get(auth, userController.dataIni);   

module.exports = router;