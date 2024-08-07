const sql = require("mssql");

exports.dataIni = async (req, res) => {
    const { IdUsuario } = req.query;
    const request = new sql.Request();
    request.input('IdUsuario', sql.Int, IdUsuario);
    const sql_str = `SELECT * FROM vw_UsuarioDatosIniciales WHERE IdUsuario=@IdUsuario`;
    request.query(sql_str)
        .then((result) => {
            res.status(200).json({ 
                data: result.recordset[0],
                message: 'Datos obtenidos correctamente' 
            });
        })
        .catch((err) => {
            console.error('dataIni Error: ',err);
            res.status(500).json({ 
                error: err,
                message: 'Error al intentar obtener los datos' 
            });
        });
};

exports.historialCursos = async (req, res) => {
    const { IdUsuario } = req.query;
    const request = new sql.Request();
    request.input('IdUsuario', sql.Int, IdUsuario);
    const sql_str = `
        WITH CursosRanking AS (
            SELECT 
                IdCurso,
                ProgresoCurso,
                NombreCurso, 
                ImagenCurso,
                FechaUltimoAcceso,
                ROW_NUMBER() OVER(PARTITION BY IdCurso ORDER BY FechaUltimoAcceso DESC) AS Rnk
            FROM 
                vw_UsuarioHistorialCursos 
            WHERE 
                IdUsuario=@IdUsuario
        )
        SELECT 
            IdCurso,
            ProgresoCurso,
            NombreCurso, 
            ImagenCurso,
            FechaUltimoAcceso AS fechaReciente
        FROM 
            CursosRanking
        WHERE 
            Rnk = 1
    `;
    request.query(sql_str)
        .then((result) => {
            res.status(200).json({ 
                data: result.recordset,
                message: 'Datos obtenidos correctamente' 
            });
        })
        .catch((err) => {
            console.error('historialCursos Error: ',err);
            res.status(500).json({ 
                error: err,
                message: 'Error al intentar obtener los datos' 
            });
        });
}