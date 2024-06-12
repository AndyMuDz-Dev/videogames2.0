const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
const { API_KEY } = process.env;
const { Videogame } = require('../db');

const getGameName = async (req, res) => {
  try {
    const { search } = req.query;

    if (!search) {
      return res.status(400).json({
        error: 'Debe proporcionar un criterio de búsqueda',
      });
    }

    // Obtener resultados de la base de datos
    const dbResult = await Videogame.findAll({ limit: 100 });

    // Obtener resultados de la API
    const responseApi = await axios.get(
      `https://api.rawg.io/api/games?key=${API_KEY}&page_size=100`
    );
    const apiResult = responseApi.data.results;

    // Combinar resultados
    const allResults = [...dbResult, ...apiResult];

    let results15Items;

    // Filtrar resultados basado en la consulta de búsqueda
    const filteredResults = allResults.filter((game) =>
      game.name.toLowerCase().includes(search.toLowerCase())
    );

    if (filteredResults.length > 0) {
      results15Items = filteredResults.slice(0, 15);
      return res.status(200).json(results15Items);
    } else {
      return res.status(404).json({
        message:
          'No se encontraron videojuegos con el término de búsqueda proporcionado',
      });
    }
  } catch (error) {
    console.error('Error al buscar videojuegos por nombre:', error);
    return res
      .status(500)
      .json({ error: 'Error al buscar videojuegos por nombre.' });
  }
};

module.exports = getGameName;
