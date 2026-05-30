import jwt from 'jsonwebtoken';

const verificarToken = (req, res, next) => {

    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({
            error: 'Token requerido'
        });
    }

    try {

        const tokenLimpio = token.replace('Bearer ', '');

        const decoded = jwt.verify(tokenLimpio, 'secreto123');

        req.usuario = decoded;

        next();

    } catch (error) {

        return res.status(403).json({
            error: 'Token inválido'
        });

    }

};

export default verificarToken;