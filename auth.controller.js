const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_ethnotech';

const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Check if user exists
    const userCheck = await query('SELECT id FROM utilisateurs WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Cet email est déjà utilisé' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Default username if name not provided
    const username = name || email.split('@')[0];

    // Insert user
    const result = await query(
      'INSERT INTO utilisateurs (nom_utilisateur, email, mot_de_passe) VALUES ($1, $2, $3) RETURNING id, nom_utilisateur, email, niveau_apprentissage, xp, lessons_completed, streak',
      [username, email, hashedPassword]
    );

    const user = result.rows[0];
    
    // Generate token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      success: true,
      token,
      user
    });
  } catch (error) {
    console.error('Erreur register:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await query('SELECT * FROM utilisateurs WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Identifiants invalides' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.mot_de_passe);
    
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Identifiants invalides' });
    }

    // Generate token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '30d' });

    // Remove password from response
    delete user.mot_de_passe;

    res.json({
      success: true,
      token,
      user
    });
  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const getMe = async (req, res) => {
  try {
    // req.user is set by authMiddleware
    const result = await query('SELECT id, nom_utilisateur, email, niveau_apprentissage, date_inscription, xp, lessons_completed, streak FROM utilisateurs WHERE id = $1', [req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Utilisateur introuvable' });
    }
    res.json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error('Erreur getMe:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

module.exports = {
  register,
  login,
  getMe
};
