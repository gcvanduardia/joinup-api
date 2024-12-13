const sql = require("mssql");
const { generateToken, verifyToken } = require('../config/jwt');

exports.logIn = async (req, res) => {
    const { username, password } = req.body;
    const request = new sql.Request();

    // Use parameters to prevent SQL injection
    request.input('username', sql.NVarChar, username);
    request.input('password', sql.NVarChar, password);
    const sql_str = `SELECT ISNULL( (SELECT IdUsuario FROM Usuarios WHERE Enable=1 AND Email=@username AND Password=@password), 0 ) AS IdUsuario;`;

    request.query(sql_str)
        .then((result) => {
            if (result.recordset[0].IdUsuario > 0) {
                const IdUsuario = result.recordset[0].IdUsuario;
                const token = generateToken(IdUsuario);
                res.status(200).json({ 
                    token: token, 
                    IdUsuario: IdUsuario, 
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
            console.error('logIn Error: ',err);
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

exports.register = async (req, res) => {
    const { firstName: nombres, lastName: apellidos, email, document: documento, phone: telefono, password } = req.body;

    // Comprueba si todos los campos están definidos
    if (!nombres || !apellidos || !email || !documento || !telefono || !password) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const request = new sql.Request();

    // Primero, verifica si el usuario ya existe
    const checkUserQuery = `SELECT * FROM Usuarios WHERE Email = @email OR Documento = @documento`;

    request.input('email', sql.NVarChar, email);
    request.input('documento', sql.NVarChar, documento);
    
    request.query(checkUserQuery)
        .then(result => {
            if (result.recordset.length > 0) {
                // Si el usuario ya existe, envía un mensaje de error
                res.status(400).json({ message: 'El usuario ya existe' });
            } else {
                // Si el usuario no existe, procede a insertarlo en la base de datos
                request.input('nombres', sql.NVarChar, nombres);
                request.input('apellidos', sql.NVarChar, apellidos);
                request.input('celular', sql.NVarChar, telefono);
                request.input('pass', sql.NVarChar, password);

                const sql_str = `INSERT INTO Usuarios (IdUsuario, Nombres, Apellidos, Email, Documento, Celular, Password, Enable) VALUES ((SELECT MAX(IdUsuario)+1 FROM Usuarios),@nombres, @apellidos, @email, @documento, @celular, @pass, 1)`;

                request.query(sql_str)
                    .then(() => {
                        res.status(200).json({ 
                            message: 'Usuario registrado correctamente' 
                        });
                    })
                    .catch((err) => {
                        console.log('Error register: ', err)
                        res.status(500).json({ 
                            error: err,
                            message: 'Error al intentar registrar al usuario' 
                        });
                    });
            }
        })
        .catch(err => {
            console.error('Error register: ',err);
            res.status(500).json({ 
                error: err,
                message: 'Error al intentar verificar al usuario' 
            });
        });
}