const { Videogame, Genres } = require('../db');
const { validate: isUUID } = require('uuid');

const deleteGame = async (req, res) => {
  const { id } = req.params;

  if (!isUUID(id)) {
    return res.status(400).json({ error: 'ID de videojuego inválido' });
  }
  try {
    const dbVideoGame = await Videogame.findByPk(id, {
      includes: Genres,
    });

    if (!dbVideoGame) {
      res
        .status(400)
        .json({ error: 'videojuego no encontrado en la base de datos' });
    }

    await dbVideoGame.destroy();
    const deletedGame = dbVideoGame.toJSON();

    return res.json({
      deletedGame,
    });
  } catch (error) {
    console.error('Error al eliminar el videojuego:', error);
    return res
      .status(500)
      .json({ error: 'Ocurrió un error al eliminar el videojuego' });
  }
};

module.exports = deleteGame;
