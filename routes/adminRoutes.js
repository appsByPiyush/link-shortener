const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware');

const {
  listUsers,
  getUserLinksPaginated,
  exportUserLinksCSV,
} = require('../controllers/adminController');

// Must be logged in AND admin
router.get('/users', verifyToken, isAdmin, listUsers);
router.get('/users/:userId/links', verifyToken, isAdmin, getUserLinksPaginated);
router.get(
  '/users/:userId/export',
  verifyToken,
  isAdmin,
  exportUserLinksCSV
);

module.exports = router;
