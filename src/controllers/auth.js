const sql = require("mssql");
const { generateToken, verifyToken } = require('../config/jwt');

exports.logIn = async (req, res) => {
    const { username, password } = req.body;
    const request = new sql.Request();

    // Use parameters to prevent SQL injection
    request.input('username', sql.NVarChar, username);
    request.input('password', sql.NVarChar, password);
    const sql_str = `
        SELECT 
            ISNULL((SELECT IdUsuario FROM Users WHERE Enable=1 AND Email=@username AND Password=@password), 0) AS IdUsuario,
            (SELECT UserName FROM Users WHERE Enable=1 AND Email=@username AND Password=@password) AS UserName
    `;

    request.query(sql_str)
        .then((result) => {
            if (result.recordset[0].IdUsuario > 0) {
                const IdUsuario = result.recordset[0].IdUsuario;
                const UserName = result.recordset[0].UserName;
                const token = generateToken(IdUsuario);
                res.status(200).json({ 
                    token: token, 
                    IdUsuario: IdUsuario, 
                    isUserNameNull: UserName === null,
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
            console.error('logIn Error: ', err);
            res.status(500).json({ 
                error: err,
                message: 'Error al intentar logearse' 
            });
        });
};
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
    const { firstName: nombres, lastName: apellidos, email, password } = req.body;

    // Comprueba si todos los campos están definidos
    if (!nombres || !apellidos || !email || !password) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const request = new sql.Request();

    // Primero, verifica si el usuario ya existe
    const checkUserQuery = `SELECT * FROM Users WHERE Email = @Email`;

    request.input('Email', sql.NVarChar, email);
    
    request.query(checkUserQuery)
        .then(result => {
            if (result.recordset.length > 0) {
                // Si el usuario ya existe, envía un mensaje de error
                res.status(400).json({ message: 'El usuario ya existe' });
            } else {
                // Si el usuario no existe, procede a insertarlo en la base de datos
                request.input('Nombres', sql.NVarChar, nombres);
                request.input('Apellidos', sql.NVarChar, apellidos);
                request.input('Password', sql.NVarChar, password);


                const sql_str = `
                    INSERT INTO Users (Nombres, Apellidos, Email, Password, Enable, IdRol)
                    OUTPUT INSERTED.IdUsuario
                    VALUES (@Nombres, @Apellidos, @Email, @Password, 1, 3)
                `;

                request.query(sql_str)
                    .then(result => {
                        const IdUsuario = result.recordset[0].IdUsuario;
                        res.status(200).json({ 
                            message: 'Usuario registrado correctamente',
                            IdUsuario: IdUsuario
                        });
                    })
                    .catch((err) => {
                        console.log('Error register: ', err);
                        res.status(500).json({ 
                            error: err,
                            message: 'Error al intentar registrar al usuario' 
                        });
                    });
            }
        })
        .catch(err => {
            console.error('Error register: ', err);
            res.status(500).json({ 
                error: err,
                message: 'Error al intentar verificar al usuario' 
            });
        });
};

exports.updateUserProfile = async (req, res) => {
    const { IdUsuario, UserName, Avatar } = req.body;

    // Comprueba si todos los campos están definidos
    if (!IdUsuario || !UserName || !Avatar) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const request = new sql.Request();

    // Actualiza el registro del usuario
    const sql_str = `
        UPDATE Users
        SET UserName = @UserName, Avatar = @Avatar
        WHERE IdUsuario = @IdUsuario
    `;

    request.input('IdUsuario', sql.Int, IdUsuario);
    request.input('UserName', sql.NVarChar, UserName);
    request.input('Avatar', sql.NVarChar, Avatar);

    request.query(sql_str)
        .then(() => {
            res.status(200).json({ 
                message: 'Perfil de usuario actualizado correctamente' 
            });
        })
        .catch((err) => {
            console.error('updateUserProfile Error: ', err);
            res.status(500).json({ 
                error: err,
                message: 'Error al intentar actualizar el perfil del usuario' 
            });
        });
};