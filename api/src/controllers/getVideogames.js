const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
const { API_KEY } = process.env;
const { Videogame, Genres } = require('../db');

const get105VideogamesApi = async () => {
  const URL = `http://api.rawg.io/api/games?key=${API_KEY}&page_size=15`;
  let allVideoGames = [];
  let page = 1;

  const totalpages = 7;
  try {
    for (let i = 0; i < totalpages; i++) {
      const response = await axios.get(`${URL}&page=${page}`);

      const dataApi = response.data;

      const videogame = dataApi.results.map((game) => ({
        id: game.id,
        name: game.name,
        description: game.description || 'no description available',
        platforms: game.platforms
          .map((p) =>
            p.platform ? p.platform.name && p.platform.image_background : ' '
          )
          .join(', '),
        background_image: game.background_image,
        released: game.released,
        rating: game.rating,
        genres: game.genres
          ? game.genres.map((g) => ({ id: g.id, name: g.name }))
          : ' ',
      }));

      allVideoGames = [...allVideoGames, ...videogame];
      page++;
    }

    return allVideoGames;
  } catch (error) {
    throw new Error('Error al obtener los juegos de la APi');
  }
};

const getAllVideogames = async (req, res) => {
  try {
    const dbVideoGames = await Videogame.findAll({
      include: Genres,
    });

    const apiGames = await get105VideogamesApi();

    const allGames = [...dbVideoGames, ...apiGames];

    res.status(200).json(allGames);
  } catch (error) {
    console.error('Error fetching all video games:', error);
    res.status(500).json({ error: 'Error fetching all video games' });
  }
};

module.exports = getAllVideogames;
