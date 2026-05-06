const { query } = require('../config/db');

const getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await query(
      `SELECT m.*, f.id as favorite_id, f.date_ajout 
       FROM favoris f 
       JOIN mots m ON f.mot_id = m.id 
       WHERE f.utilisateur_id = $1 
       ORDER BY f.date_ajout DESC`,
      [userId]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Erreur getFavorites:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const addFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { mot_id } = req.body;

    if (!mot_id) {
      return res.status(400).json({ success: false, message: 'mot_id est requis' });
    }

    // Check if word exists
    const wordCheck = await query('SELECT id FROM mots WHERE id = $1', [mot_id]);
    if (wordCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Mot introuvable' });
    }

    // Insert (ignoring duplicate if already favorite)
    await query(
      'INSERT INTO favoris (utilisateur_id, mot_id) VALUES ($1, $2) ON CONFLICT (utilisateur_id, mot_id) DO NOTHING',
      [userId, mot_id]
    );

    res.status(201).json({ success: true, message: 'Ajouté aux favoris' });
  } catch (error) {
    console.error('Erreur addFavorite:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const motId = req.params.id;

    await query(
      'DELETE FROM favoris WHERE utilisateur_id = $1 AND mot_id = $2',
      [userId, motId]
    );

    res.json({ success: true, message: 'Retiré des favoris' });
  } catch (error) {
    console.error('Erreur removeFavorite:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite
};
