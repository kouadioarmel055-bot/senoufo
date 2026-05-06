const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_ethnotech';

const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = { id: decoded.id };
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ success: false, message: 'Non autorisé, token invalide' });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Non autorisé, pas de token' });
  }
};

module.exports = { protect };
