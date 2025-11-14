// MOCK AUTH MIDDLEWARE - ACCEPTS ANY TOKEN
const authMiddleware = (req, res, next) => {
  req.user = { id: 1, username: 'admin' };
  next();
};

module.exports = authMiddleware;