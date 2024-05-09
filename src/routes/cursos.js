const express = require('express');
const router = express.Router();
const cursosController = require('../controllers/cursos');
const auth = require('../middleware/jwt');

router.route('/getRecursosSesion')
    .get(auth, cursosController.getRecursosSesion);

router.route('/getComentariosSesion')
    .get(auth, cursosController.getComentariosSesion);

router.route('/getDetalleSesion')
    .get(auth, cursosController.getDetalleSesion);

router.route('/getListadoSesiones')
    .get(auth, cursosController.getListadoSesiones);

router.route('/getCursosPaginated')
    .get(auth, cursosController.getCursosPaginated);

router.route('/getCursoDetail')
    .get(auth, cursosController.getCursoDetail);

module.exports = router;