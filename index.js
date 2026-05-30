import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import express from 'express';
import sequelize from './database.js';

import Pelicula from './models/Pelicula.js';
import Usuario from './models/Usuario.js';

import verificarToken from './middleware/auth.js';

const app = express();

app.use(express.json());

// ======================
// CONECTAR BASE DE DATOS
// ======================

try {

    await sequelize.authenticate();

    console.log('Conexión con PostgreSQL establecida correctamente.');

    await sequelize.sync();

    console.log('Tablas sincronizadas correctamente.');

} catch (error) {

    console.error('Error al inicializar la base de datos:', error);

}

// ======================
// CREAR USUARIO ADMIN
// ======================

const passwordHash = await bcrypt.hash('123456', 10);

await Usuario.findOrCreate({

    where: {
        usuario: 'admin'
    },

    defaults: {
        password: passwordHash
    }

});

// ======================
// INSERTAR PELICULAS
// ======================

await Pelicula.bulkCreate([

    {
        titulo: 'Amores Perros',
        director: 'Alejandro González Iñárritu',
        anio: 2000,
        genero: 'Drama'
    },

    {
        titulo: 'Y Tu Mamá También',
        director: 'Alfonso Cuarón',
        anio: 2001,
        genero: 'Drama'
    },

    {
        titulo: 'Nosotros los Nobles',
        director: 'Gary Alazraki',
        anio: 2013,
        genero: 'Comedia'
    },

    {
        titulo: 'Roma',
        director: 'Alfonso Cuarón',
        anio: 2018,
        genero: 'Drama'
    },

    {
        titulo: 'El Infierno',
        director: 'Luis Estrada',
        anio: 2010,
        genero: 'Drama'
    },

    {
        titulo: 'La Dictadura Perfecta',
        director: 'Luis Estrada',
        anio: 2014,
        genero: 'Comedia'
    },

    {
        titulo: 'Macario',
        director: 'Roberto Gavaldón',
        anio: 1960,
        genero: 'Drama'
    },

    {
        titulo: 'Como Agua para Chocolate',
        director: 'Alfonso Arau',
        anio: 1992,
        genero: 'Romance'
    },

    {
        titulo: 'Cronos',
        director: 'Guillermo del Toro',
        anio: 1993,
        genero: 'Terror'
    },

    {
        titulo: 'No se Aceptan Devoluciones',
        director: 'Eugenio Derbez',
        anio: 2013,
        genero: 'Comedia'
    }

], {
    ignoreDuplicates: true
});

// ======================
// LOGIN
// ======================

app.post('/login', async (req, res) => {

    const { usuario, password } = req.body;

    const user = await Usuario.findOne({

        where: {
            usuario
        }

    });

    if (!user) {

        return res.status(404).json({
            error: 'Usuario no encontrado'
        });

    }

    const passwordValido = await bcrypt.compare(password, user.password);

    if (!passwordValido) {

        return res.status(401).json({
            error: 'Contraseña incorrecta'
        });

    }

    const token = jwt.sign(
    {
        id: user.id,
        usuario: user.usuario
    },
    process.env.JWT_SECRET,
    {
        expiresIn: '1h'
    }
);

    res.json({
        token
    });

});

// ======================
// API GET CONSULTA TODAS
// ======================

app.get('/peliculas', verificarToken, async (req, res) => {

    const peliculas = await Pelicula.findAll();

    res.json(peliculas);

});

// ======================
// API GET CONSULTA POR ID
// ======================

app.get('/peliculas/:id', verificarToken, async (req, res) => {

    const pelicula = await Pelicula.findByPk(req.params.id);

    if (pelicula) {

        res.json(pelicula);

    } else {

        res.status(404).json({
            error: 'Película no encontrada'
        });

    }

});

// ======================
// API GET POR GENERO
// ======================

app.get('/peliculas/genero/:genero', verificarToken, async (req, res) => {

    const peliculas = await Pelicula.findAll({

        where: {
            genero: req.params.genero
        }

    });

    res.json(peliculas);

});

// ======================
// API GET ORDENADAS POR AÑO
// ======================

app.get('/peliculas/orden/anio', verificarToken, async (req, res) => {

    const peliculas = await Pelicula.findAll({

        order: [['anio', 'ASC']]

    });

    res.json(peliculas);

});

// ======================
// API POST
// ======================

app.post('/peliculas', verificarToken, async (req, res) => {

    const pelicula = await Pelicula.create(req.body);

    res.status(201).json(pelicula);

});

// ======================
// API PUT
// ======================

app.put('/peliculas/:id', verificarToken, async (req, res) => {

    const pelicula = await Pelicula.findByPk(req.params.id);

    if (pelicula) {

        await pelicula.update(req.body);

        res.json(pelicula);

    } else {

        res.status(404).json({
            error: 'Película no encontrada'
        });

    }

});

// ======================
// API DELETE
// ======================

app.delete('/peliculas/:id', verificarToken, async (req, res) => {

    const eliminado = await Pelicula.destroy({

        where: {
            id: req.params.id
        }

    });

    res.json({
        eliminado: !!eliminado
    });

});

// ======================
// SERVIDOR
// ======================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`API lista en puerto ${PORT}`);
});