const express = require('express');
const router = express.Router();
const cursosController = require('../controllers/cursos');
const auth = require('../middleware/jwt');

router.route('/getUserProgress')
    .get(auth, cursosController.getUserProgress);

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

router.route('/getCursosPaginatedPublic')
    .get(cursosController.getCursosPaginated);

router.route('/getCursoDetail')
    .get(auth, cursosController.getCursoDetail);

router.route('/getCursoDetailPublic')
    .get(cursosController.getCursoDetail);

router.route('/getListadoCursos')
    .get(auth, cursosController.buscarCursos);

router.route('/getListadoCursosToolBar')
    .get(auth, cursosController.buscarCursosToolBar);

router.route('/updateOrCreateHistorialCurso')
    .post(auth, cursosController.updateOrCreateHistorialCurso);

router.route('/getUserCourseProgress')
    .get(auth, cursosController.getUserCourseProgress);

router.route('/getCursoEnVivo')
    .get(auth, cursosController.getCursoEnVivo);

router.route('/checkCursoUsuario')
    .get(auth, cursosController.checkCursoUsuario);

router.route('/userLiveTracker')
    .get(auth, cursosController.userLiveTracker);

router.route('/getCursosPaginatedByCategoriaPublic')
    .get(cursosController.getCursosPaginatedByCategoria);


module.exports = router;