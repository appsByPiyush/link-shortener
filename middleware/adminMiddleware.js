const isAdmin = (req, res, next) => {
  if (req.user?.type === 1) {
    next();
  } else {
    res.status(403).json({ message: 'Admin access required.' });
  }
};
module.exports = isAdmin;