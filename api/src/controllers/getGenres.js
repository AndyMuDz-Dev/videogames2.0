const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
const { API_KEY } = process.env;
const { Genres } = require('../db');

const getGenres = async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.rawg.io/api/genres?key=${API_KEY}`
    );

    // obtenemos los nombres de los generos de la Api

    const apiGenres = response.data.results.map((g) => {
      return {
        id: g.id,
        name: g.name,
      };
    });

    //verificamos si la base de datos esta vacia en el campo genres.

    const genresFromDB = await Genres.findAll();

    if (genresFromDB.length === 0) {
      await Genres.bulkCreate(apiGenres);
    }

    //obtenemos nuevamente los generos:

    const genres = await Genres.findAll();
   
    console.log(genres);
    // DEVOLVEMOS LOS GENEROS COMO RESPUESTA:
    return res.status(200).json(genres);
   
  } catch (error) {
    console.error('Error al buscar los generos:', error);
    return res.status(500).json({
      error: 'Error al buscar los generos',
    });
  }
};

module.exports = getGenres;
