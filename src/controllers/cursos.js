const sql = require("mssql");

exports.getCursosPaginated = async (req, res) => {
    const { pageSize, pageNumber } = req.query;

    if (!pageSize || !pageNumber) {
        return res.status(400).json({ message: 'pageSize y pageNumber son requeridos' });
    }

    const request = new sql.Request();
    request.input('PageSize', sql.Int, pageSize);
    request.input('PageNumber', sql.Int, pageNumber);
    const sql_str = `
        SELECT * FROM vw_EncabezadoCursos ORDER BY CursoId ASC 
            OFFSET (@PageNumber - 1) * @PageSize ROWS 
            FETCH NEXT @PageSize ROWS ONLY;
    `;
    request.query(sql_str)
        .then((result) => {
            res.status(200).json({ 
                data: result.recordset,
                message: 'Cursos obtenidos correctamente' 
            });
        })
        .catch((err) => {
            console.error('getCursosPaginated Error: ',err);
            res.status(500).json({ 
                error: err,
                message: 'Error al intentar obtener los cursos' 
            });
        });
};

exports.buscarCursos = async (req, res) => {
    const { terminoBusqueda } = req.query;

    if (!terminoBusqueda) {
        return res.status(400).json({ message: 'terminoBusqueda es requerido' });
    }

    const request = new sql.Request();
    request.input('TerminoBusqueda', sql.NVarChar, terminoBusqueda);
    const sql_str = `
        SELECT CursoId, Nombre, Descripcion, Imagen, Profesor FROM vw_KeyBusqueda 
        WHERE KeyBusqueda COLLATE SQL_Latin1_General_CP1_CI_AI 
        LIKE '%' + @TerminoBusqueda COLLATE SQL_Latin1_General_CP1_CI_AI + '%'
    `;
    request.query(sql_str)
        .then((result) => {
            res.status(200).json({ 
                data: result.recordset,
                message: 'Resultados de la búsqueda obtenidos correctamente' 
            });
        })
        .catch((err) => {
            console.error('buscarCursos Error: ',err);
            res.status(500).json({ 
                error: err,
                message: 'Error al intentar realizar la búsqueda' 
            });
        });
};

exports.getCursoDetail = async (req, res) => {
    const { cursoId } = req.query;

    if (!cursoId) {
        return res.status(400).json({ message: 'cursoId es requerido' });
    }

    const request = new sql.Request();
    request.input('CursoId', sql.Int, cursoId);
    const sql_str = `
        SELECT * FROM vw_DetalleCurso WHERE CursoId = @CursoId;
    `;
    request.query(sql_str)
        .then((result) => {
            res.status(200).json({ 
                data: result.recordset[0],
                message: 'Detalle del curso obtenido correctamente' 
            });
        })
        .catch((err) => {
            console.error('getCursoDetail Error: ',err);
            res.status(500).json({ 
                error: err,
                message: 'Error al intentar obtener el detalle del curso' 
            });
        });
};

exports.getListadoSesiones = async (req, res) => {
    const { IdCurso } = req.query;

    if (!IdCurso) {
        return res.status(400).json({ message: 'IdCurso es requerido' });
    }

    const request = new sql.Request();
    request.input('IdCurso', sql.Int, IdCurso);
    const sql_str = `
        SELECT * FROM vw_ListadoSesiones WHERE IdCurso = @IdCurso ORDER BY Orden ASC;
    `;
    request.query(sql_str)
        .then((result) => {
            res.status(200).json({ 
                data: result.recordset,
                message: 'Listado de sesiones obtenido correctamente' 
            });
        })
        .catch((err) => {
            console.error('getListadoSesiones Error: ',err);
            res.status(500).json({ 
                error: err,
                message: 'Error al intentar obtener el listado de sesiones' 
            });
        });
};

exports.getDetalleSesion = async (req, res) => {
    const { IdSesion } = req.query;

    if (!IdSesion) {
        return res.status(400).json({ message: 'IdSesion es requerido' });
    }

    const request = new sql.Request();
    request.input('IdSesion', sql.Int, IdSesion);

    const sql_str = `
        SELECT * FROM Sesiones WHERE IdSesion = @IdSesion;
    `;

    request.query(sql_str)
        .then((result) => {
            res.status(200).json({ 
                data: result.recordset[0],
                message: 'Detalle de la sesión obtenido correctamente' 
            });
        })
        .catch((err) => {
            console.error('getDetalleSesion Error: ',err);
            res.status(500).json({ 
                error: err,
                message: 'Error al intentar obtener el detalle de la sesión' 
            });
        });
};

exports.getComentariosSesion = async (req, res) => {
    const { IdSesion } = req.query;

    if (!IdSesion) {
        return res.status(400).json({ message: 'IdSesion es requerido' });
    }

    const request = new sql.Request();
    request.input('IdSesion', sql.Int, IdSesion);

    const sql_str = `
        SELECT * FROM vw_Comentarios WHERE IdSesion = @IdSesion;
    `;

    request.query(sql_str)
        .then((result) => {
            res.status(200).json({ 
                data: result.recordset,
                message: 'Comentarios de la sesión obtenidos correctamente' 
            });
        })
        .catch((err) => {
            console.error('getComentariosSesion Error: ',err);
            res.status(500).json({ 
                error: err,
                message: 'Error al intentar obtener los comentarios de la sesión' 
            });
        });
};

exports.getRecursosSesion = async (req, res) => {
    const { IdSesion } = req.query;

    if (!IdSesion) {
        return res.status(400).json({ message: 'IdSesion es requerido' });
    }

    const request = new sql.Request();
    request.input('IdSesion', sql.Int, IdSesion);

    const sql_str = `
        SELECT * FROM RecursosSesion WHERE IdSesion = @IdSesion;
    `;

    request.query(sql_str)
        .then((result) => {
            res.status(200).json({ 
                data: result.recordset,
                message: 'Recursos de la sesión obtenidos correctamente' 
            });
        })
        .catch((err) => {
            console.error('getRecursosSesion Error: ',err);
            res.status(500).json({ 
                error: err,
                message: 'Error al intentar obtener los recursos de la sesión' 
            });
        });
};