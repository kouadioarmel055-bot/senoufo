const { query } = require('../config/db');

// Récupérer toutes les catégories
const getCategories = async (req, res) => {
  try {
    const result = await query('SELECT * FROM categories ORDER BY nom ASC');
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Erreur getCategories:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// Récupérer tous les mots (avec pagination optionnelle)
const getMots = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;
    
    // Utiliser la vue pour avoir les mots complets avec catégories
    const result = await query(
      'SELECT * FROM v_mots_complets ORDER BY mot_francais ASC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    
    // Compter le total
    const countResult = await query('SELECT COUNT(*) FROM v_mots_complets');
    const total = parseInt(countResult.rows[0].count);
    
    res.json({
      success: true,
      data: result.rows,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erreur getMots:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// Récupérer les mots populaires
const getMotsPopulaires = async (req, res) => {
  try {
    const result = await query('SELECT * FROM v_mots_populaires LIMIT 10');
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Erreur getMotsPopulaires:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

module.exports = {
  getCategories,
  getMots,
  getMotsPopulaires
};
