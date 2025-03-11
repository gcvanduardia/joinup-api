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
    const terminoBusqueda = req.query.terminoBusqueda || '';
    const pageNumber = req.query.pageNumber || 1;
    const pageSize = req.query.pageSize || 10;   

    if (!terminoBusqueda) {
        return res.status(400).json({ message: 'terminoBusqueda es requerido' });
    }

    const request = new sql.Request();
    request.input('TerminoBusqueda', sql.NVarChar, terminoBusqueda);
    request.input('PageNumber', sql.Int, pageNumber);
    request.input('PageSize', sql.Int, pageSize);
    const sql_str = `
        SELECT CursoId, Nombre, Imagen, NombreProfesor, ApellidoProfesor, Descripcion FROM vw_EncabezadoCursos 
        WHERE KeyBusqueda COLLATE SQL_Latin1_General_CP1_CI_AI 
        LIKE '%' + @TerminoBusqueda COLLATE SQL_Latin1_General_CP1_CI_AI + '%' 
        ORDER BY CHARINDEX(@TerminoBusqueda, KeyBusqueda COLLATE Latin1_General_CI_AI), KeyBusqueda
        OFFSET (@PageNumber - 1) * @PageSize ROWS 
        FETCH NEXT @PageSize ROWS ONLY;
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

exports.buscarCursosToolBar = async (req, res) => {
    const { terminoBusqueda } = req.query;

    if (!terminoBusqueda) {
        return res.status(400).json({ message: 'terminoBusqueda es requerido' });
    }

    const request = new sql.Request();
    request.input('TerminoBusqueda', sql.NVarChar, terminoBusqueda);
    const sql_str = `
        SELECT top 5 CursoId, Nombre, Descripcion, Imagen, Profesor FROM vw_KeyBusqueda 
        WHERE KeyBusqueda COLLATE SQL_Latin1_General_CP1_CI_AI 
        LIKE '%' + @TerminoBusqueda COLLATE SQL_Latin1_General_CP1_CI_AI + '%'
        ORDER BY CHARINDEX(@TerminoBusqueda, KeyBusqueda COLLATE Latin1_General_CI_AI), KeyBusqueda
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

exports.getUserProgress = async (req, res) => {
    const { IdUsuario, IdSesion } = req.query;

    if (!IdUsuario || !IdSesion) {
        return res.status(400).json({ message: 'IdUsuario e IdSesion son requeridos' });
    }

    const request = new sql.Request();
    request.input('IdUsuario', sql.Int, IdUsuario);
    request.input('IdSesion', sql.Int, IdSesion);
    const sql_str = `
        SELECT Completada, ProgresoSesion, MinutoActual FROM vw_UsuarioHistorialCursos 
        WHERE IdUsuario = @IdUsuario AND IdSesion = @IdSesion;
    `;
    request.query(sql_str)
        .then((result) => {
            res.status(200).json({ 
                data: result.recordset[0],
                message: 'Progreso del usuario obtenido correctamente' 
            });
        })
        .catch((err) => {
            console.error('getProgresoUsuario Error: ',err);
            res.status(500).json({ 
                error: err,
                message: 'Error al intentar obtener el progreso del usuario' 
            });
        });
};

exports.updateOrCreateHistorialCurso = async (req, res) => {
    const { IdUsuario, IdCurso, IdSesion, MinutoActual, ProgresoSesion, ProgresoCurso, Completada } = req.body;

    if (IdUsuario === undefined || IdCurso === undefined || IdSesion === undefined || MinutoActual === undefined || ProgresoSesion === undefined || ProgresoCurso === undefined || Completada === undefined) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const request = new sql.Request();
    request.input('IdUsuario', sql.Int, IdUsuario);
    request.input('IdCurso', sql.Int, IdCurso);
    request.input('IdSesion', sql.Int, IdSesion);
    request.input('MinutoActual', sql.Int, MinutoActual);
    request.input('ProgresoSesion', sql.Int, ProgresoSesion);
    request.input('ProgresoCurso', sql.Float, ProgresoCurso);
    request.input('Completada', sql.Bit, Completada);

    const sql_str_check = `
        SELECT * FROM HistorialCursos 
        WHERE IdUsuario = @IdUsuario AND IdCurso = @IdCurso AND IdSesion = @IdSesion;
    `;

    const sql_str_update = `
        UPDATE HistorialCursos 
        SET MinutoActual = @MinutoActual, ProgresoSesion = @ProgresoSesion, ProgresoCurso = @ProgresoCurso, Completada = @Completada
        WHERE IdUsuario = @IdUsuario AND IdCurso = @IdCurso AND IdSesion = @IdSesion;
    `;

    const sql_str_insert = `
        INSERT INTO HistorialCursos (IdHistorial, IdUsuario, IdCurso, IdSesion, MinutoActual, ProgresoSesion, ProgresoCurso, Completada)
        VALUES (ISNULL((SELECT MAX(IdHistorial) + 1 FROM HistorialCursos), 1), @IdUsuario, @IdCurso, @IdSesion, @MinutoActual, @ProgresoSesion, @ProgresoCurso, @Completada);
    `;

    request.query(sql_str_check)
        .then((result) => {
            if (result.recordset.length > 0) {
                // Si el registro existe, lo actualizamos
                return request.query(sql_str_update);
            } else {
                // Si el registro no existe, lo creamos
                return request.query(sql_str_insert);
            }
        })
        .then(() => {
            res.status(200).json({ 
                message: 'Registro actualizado o creado correctamente' 
            });
        })
        .catch((err) => {
            console.error('updateOrCreateHistorialCurso Error: ', err);
            res.status(500).json({ 
                error: err,
                message: 'Error al intentar actualizar o crear el registro' 
            });
        });
};

exports.getUserCourseProgress = async (req, res) => {
    const { IdUsuario, IdCurso } = req.query;

    if (!IdUsuario || !IdCurso) {
        return res.status(400).json({ message: 'IdUsuario y IdCurso son requeridos' });
    }

    const request = new sql.Request();
    request.input('IdUsuario', sql.Int, IdUsuario);
    request.input('IdCurso', sql.Int, IdCurso);

    const sql_str = `
        DECLARE @TotalProgresoSesion INT;
        DECLARE @HorasVideo INT;
        
        -- Obtener la suma de ProgresoSesion
        SELECT @TotalProgresoSesion = SUM(ProgresoSesion)
        FROM HistorialCursos
        WHERE IdUsuario = @IdUsuario AND IdCurso = @IdCurso;
        
        -- Obtener las HorasVideo del curso
        SELECT @HorasVideo = HorasVideo
        FROM Cursos
        WHERE CursoId = @IdCurso;

        -- Calcular el progreso total del curso
        SELECT 
            (@TotalProgresoSesion / (@HorasVideo * 60.0)) * 100 AS ProgresoTotalCurso;
    `;

    request.query(sql_str)
        .then((result) => {
            res.status(200).json({ 
                progreso: result.recordset[0].ProgresoTotalCurso,
                message: 'Progreso del curso obtenido correctamente' 
            });
        })
        .catch((err) => {
            console.error('getUserCourseProgress Error: ', err);
            res.status(500).json({ 
                error: err,
                message: 'Error al intentar obtener el progreso del curso' 
            });
        });
};

exports.getCursoEnVivo = async (req, res) => {
    const { CursoId, Rol } = req.query;

    if (!CursoId) {
        return res.status(400).json({ message: 'CursoId es requerido' });
    }

    if (!Rol) {
        return res.status(400).json({ message: 'Rol es requerido' });
    }

    const request = new sql.Request();
    request.input('CursoId', sql.Int, CursoId);

    let sql_str;
    if (Rol == 1) {
        sql_str = `
            SELECT RoomCodeHost, HoraProgramada FROM CursosEnVivo WHERE CursoId = @CursoId;
        `;
    } else if (Rol == 2) {
        sql_str = `
            SELECT RoomCodeGuest, HoraProgramada FROM CursosEnVivo WHERE CursoId = @CursoId;
        `;
    } else {
        return res.status(400).json({ message: 'Rol no válido' });
    }

    request.query(sql_str)
        .then((result) => {
            if (result.recordset.length > 0) {
                res.status(200).json({ 
                    data: result.recordset[0],
                    message: 'Curso en vivo obtenido correctamente' 
                });
            } else {
                res.status(404).json({ 
                    message: 'Curso en vivo no encontrado' 
                });
            }
        })
        .catch((err) => {
            console.error('getCursosEnVivo Error: ', err);
            res.status(500).json({ 
                error: err,
                message: 'Error al intentar obtener el curso en vivo' 
            });
        });
};

exports.checkCursoUsuario = async (req, res) => {
    const { IdCurso, IdUsuario } = req.query;

    if (!IdCurso || !IdUsuario) {
        const response = { message: 'IdCurso e IdUsuario son requeridos' };
        console.log(response);
        return res.status(400).json(response);
    }

    const request = new sql.Request();
    request.input('IdCurso', sql.Int, IdCurso);
    request.input('IdUsuario', sql.Int, IdUsuario);

    const sql_str = `
        SELECT COUNT(*) AS count FROM CursosUsuarios WHERE IdCurso = @IdCurso AND IdUsuario = @IdUsuario;
    `;

    request.query(sql_str)
        .then((result) => {
            const exists = result.recordset[0].count > 0;
            const response = { 
                exists: exists,
                message: 'Comprobación realizada correctamente' 
            };
            console.log(response);
            res.status(200).json(response);
        })
        .catch((err) => {
            const response = { 
                error: err,
                message: 'Error al intentar comprobar el registro' 
            };
            console.error('checkCursoUsuario Error: ', err);
            console.log(response);
            res.status(500).json(response);
        });
};

exports.userLiveTracker = async (req, res) => {
    const { IdUsuario, connected, accion } = req.query;

    if (!IdUsuario || !accion) {
        return res.status(400).json({ message: 'IdUsuario y accion son requeridos' });
    }

    const request = new sql.Request();
    request.input('IdUsuario', sql.Int, IdUsuario);

    if (accion === 'leer') {
        // Leer el campo actual
        const sql_str_leer = `
            SELECT isConnected FROM Users WHERE IdUsuario = @IdUsuario;
        `;

        try {
            const result = await request.query(sql_str_leer);
            if (result.recordset.length > 0) {
                const isConnected = result.recordset[0].isConnected;
                res.status(200).json({ 
                    data: { isConnected: isConnected },
                    message: 'Campo leído correctamente' 
                });
            } else {
                res.status(404).json({ message: 'Usuario no encontrado' });
            }
        } catch (err) {
            console.error('userLiveTracker Error: ', err);
            res.status(500).json({ 
                error: err,
                message: 'Error al intentar leer el campo' 
            });
        }
    } else if (accion === 'editar') {
        if (connected === undefined) {
            return res.status(400).json({ message: 'connected es requerido para editar' });
        }

        // Convertir el valor de connected a booleano
        const connectedValue = connected === 'true' || connected === '1' ? 1 : 0;

        // Editar el campo
        const sql_str_editar = `
            UPDATE Users 
            SET isConnected = @connected 
            WHERE IdUsuario = @IdUsuario;
        `;
        request.input('connected', sql.Bit, connectedValue);

        try {
            await request.query(sql_str_editar);
            res.status(200).json({ 
                message: 'Campo actualizado correctamente', 
                isConnected: connectedValue 
            });
        } catch (err) {
            console.error('userLiveTracker Error: ', err);
            res.status(500).json({ 
                error: err,
                message: 'Error al intentar actualizar el campo' 
            });
        }
    } else {
        res.status(400).json({ message: 'Acción no válida' });
    }
};