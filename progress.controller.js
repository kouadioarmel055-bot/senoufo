const { query } = require('../config/db');

const getProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await query(
      'SELECT xp, lessons_completed, streak FROM utilisateurs WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Utilisateur introuvable' });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur getProgress:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const addXp = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Montant XP invalide' });
    }

    const result = await query(
      'UPDATE utilisateurs SET xp = xp + $1 WHERE id = $2 RETURNING xp, lessons_completed, streak',
      [amount, userId]
    );

    res.json({
      success: true,
      message: 'XP mis à jour',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur addXp:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const completeLesson = async (req, res) => {
  try {
    const userId = req.user.id;
    // Base 20 XP per lesson for example
    const xpReward = 20;

    const result = await query(
      'UPDATE utilisateurs SET lessons_completed = lessons_completed + 1, xp = xp + $1 WHERE id = $2 RETURNING xp, lessons_completed, streak',
      [xpReward, userId]
    );

    res.json({
      success: true,
      message: 'Leçon terminée, progression mise à jour',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur completeLesson:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

module.exports = {
  getProgress,
  addXp,
  completeLesson
};
