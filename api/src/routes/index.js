const express = require('express');
const router = express.Router();

//controladores:
const getVideogamesApi = require('../controllers/getVideogames');
const getDetailGame = require('../controllers/getDetailGame');
const getGameName = require('../controllers/getGameName');
const postGame = require('../controllers/postGame');
const getGenres = require('../controllers/getGenres');
const deleteGame = require('../controllers/delete');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.get('/videogames', getVideogamesApi);
router.get('/videogames/name', getGameName);
router.post('/videogames/create', postGame);
router.get('/videogames/genres', getGenres);
router.get('/videogames/:id', getDetailGame);
router.delete('/videogames/delete/:id', deleteGame);

module.exports = router;
