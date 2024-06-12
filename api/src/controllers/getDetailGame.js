const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
const { API_KEY } = process.env;
const { validate: isUUID } = require('uuid');
const { Videogame, Genres } = require('../db');
const getDetailGame = async (req, res) => {
  const { id } = req.params;

  try {
    let videoGameDetail;

    if (isUUID(id)) {
      const dbDetail = Videogame.findByPk(id, { include: Genres });

      if (dbDetail) {
        const gameDetail = dbDetail.toJSON();

        gameDetail.genres = dbDetail.Genres.map((genre) => ({
          id: genre.id,
          name: genre.name,
        }));
      } else {
        return res
          .status(404)
          .json({ error: 'Videojuego no encontrado en la base de datos' });
      }
    } else {
      const responseApi = await axios.get(
        `https://api.rawg.io/api/games/${id}?key=${API_KEY}`
      );

      const apiData = responseApi.data;

      console.log(responseApi.data);

      videoGameDetail = {
        id: apiData.id,
        name: apiData.name,
        description: apiData.description_raw || 'no description available',
        platforms: apiData.platforms
          .map((p) => (p.platform ? p.platform.name : ' '))
          .join(', '),
        background_image: apiData.background_image,
        background_image_additional: apiData.background_image_additional,
        released: apiData.released,
        rating: apiData.rating,
        genres: apiData.genres
          ? apiData.genres.map((g) => ({ id: g.id, name: g.name }))
          : ' ',
      };

      res.status(200).json(videoGameDetail);
    }
  } catch (error) {
    console.error('Error al obtener los detalles del videojuego:', error);
    res
      .status(500)
      .json({ error: 'Error al obtener los detalles del videojuego' });
  }
};

module.exports = getDetailGame;
