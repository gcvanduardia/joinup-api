const sql = require("mssql");
const { generateToken, verifyToken } = require('../config/jwt');

exports.logIn = async (req, res) => {
    const { username, password } = req.body;
    const request = new sql.Request();

    // Use parameters to prevent SQL injection
    request.input('username', sql.NVarChar, username);
    request.input('password', sql.NVarChar, password);
    const sql_str = `SELECT COUNT(*) as count FROM tbl_Users WHERE En=1 AND (Username=@username OR Email=@username) AND Pass=@password`;

    request.query(sql_str)
        .then((result) => {
            if (result.recordset[0].count > 0) {
                const token = generateToken(username);
                res.status(200).json({ 
                    token: token, 
                    username: username, 
                    message: 'Usuario logeado correctamente' 
                });
            } else {
                res.status(401).json({ 
                    error: 'Unauthorized',
                    message: 'Usuario o contraseña incorrectos' 
                });
            }
        })
        .catch((err) => {
            res.status(500).json({ 
                error: err,
                message: 'Error al intentar logearse' 
            });
        });
}

exports.verifyToken = async (req, res) => {
    const token = req.headers['authorization'];

    const decoded = verifyToken(token);
    if (decoded) {
        res.status(200).json({ 
            message: 'Token is valid', 
            data: decoded 
        });
    } else {
        res.status(401).json({ 
            message: 'Token is not valid'
        });
    }
}