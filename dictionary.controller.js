const { query } = require('../config/db');

// Helper pour formater les mots selon ce qu'attend l'application Flutter (TranslationItem)
const formatRows = (rows) => {
  return rows.map(row => ({
    senoufo: row.mot_senoufo,
    french: row.mot_francais,
    context: row.definition || row.exemple_phrase || '',
    audio: row.audio_path || null
  }));
};

const translateToSenoufo = async (req, res) => {
  try {
    const { word } = req.query;
    if (!word) return res.status(400).json({ success: false, message: 'word query is required' });

    const result = await query(
      'SELECT * FROM v_mots_complets WHERE mot_francais ILIKE $1 LIMIT 10',
      [`%${word}%`]
    );

    res.json({ success: true, data: formatRows(result.rows) });
  } catch (error) {
    console.error('Erreur translateToSenoufo:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const translateToFrench = async (req, res) => {
  try {
    const { word } = req.query;
    if (!word) return res.status(400).json({ success: false, message: 'word query is required' });

    const result = await query(
      'SELECT * FROM v_mots_complets WHERE mot_senoufo ILIKE $1 LIMIT 10',
      [`%${word}%`]
    );

    res.json({ success: true, data: formatRows(result.rows) });
  } catch (error) {
    console.error('Erreur translateToFrench:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const getCategories = async (req, res) => {
  try {
    const result = await query('SELECT nom FROM categories ORDER BY nom ASC');
    const categories = result.rows.map(row => row.nom);
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Erreur getCategories:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const getCategoryWords = async (req, res) => {
  try {
    const { category } = req.params;
    const result = await query(
      'SELECT * FROM v_mots_complets WHERE categorie = $1 ORDER BY mot_francais ASC',
      [category]
    );
    res.json({ success: true, data: formatRows(result.rows) });
  } catch (error) {
    console.error('Erreur getCategoryWords:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const getDictionary = async (req, res) => {
  try {
    const result = await query('SELECT * FROM v_mots_complets ORDER BY mot_francais ASC');
    res.json({ success: true, data: formatRows(result.rows) });
  } catch (error) {
    console.error('Erreur getDictionary:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const searchDictionary = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ success: false, message: 'q query is required' });

    const result = await query(
      'SELECT * FROM v_mots_complets WHERE mot_francais ILIKE $1 OR mot_senoufo ILIKE $1 OR definition ILIKE $1 LIMIT 50',
      [`%${q}%`]
    );
    res.json({ success: true, data: formatRows(result.rows) });
  } catch (error) {
    console.error('Erreur searchDictionary:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

module.exports = {
  translateToSenoufo,
  translateToFrench,
  getCategories,
  getCategoryWords,
  getDictionary,
  searchDictionary
};
