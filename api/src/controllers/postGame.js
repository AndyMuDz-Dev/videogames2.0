const { where } = require('sequelize');
const { Videogame, Genres } = require('../db');
const { AbstractQuery } = require('sequelize/lib/dialects/abstract/query');

const postGame = async (req, res) => {
  try {
    const {
      name,
      description,
      platforms,
      background_image,
      background_image_additional,
      released,
      rating,
      genres,
    } = req.body;

    // validamos que los campos esten llenos.
    if (
      !name ||
      !description ||
      !platforms ||
      !background_image ||
      !background_image_additional ||
      !released ||
      !rating ||
      !genres
    ) {
      return res
        .status(400)
        .json({ error: 'Se requieren todos los campos llenos' });
    }

    console.log('Géneros recibidos:', genres);

    //ordenamos el array de platforms

    const platformsGroup = platforms.join(',  ');

    // creamos el videojuego en la base de datos:
    const newGame = await Videogame.create({
      name,
      description,
      platforms: platformsGroup,
      background_image,
      background_image_additional,
      released,
      rating,
    });

    // buscamos los generos:
    const genresFound = await Genres.findAll({
      where: {
        id: genres,
      },
    });
    console.log('🚀 ~ postGame ~ genresFound:', genresFound);

    if (
      !genresFound ||
      genresFound.length === 0 ||
      genresFound.length !== genres.length
    ) {
      return res
        .status(400)
        .json({ error: 'Algunos géneros no fueron encontrados' });
    }

    // agregamos los generos a la creacion del nuevo juego.
    await newGame.addGenres(genresFound);

    console.log('Géneros encontrados en la base de datos:', genresFound);

    //obtenemos el juego creado, junto a sus generos asociados.
    const gameCreatedFinal = await Videogame.findByPk(newGame.id, {
      include: Genres,
    });

    console.log('Juego creado final:', gameCreatedFinal);

    return res.status(201).json({
      created: gameCreatedFinal,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al crear el videojuego' });
  }
};

module.exports = postGame;
