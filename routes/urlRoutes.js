const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const {
  shorten,
  redirect,
  getUserLinks,
  exportUserLinksCSV
} = require('../controllers/urlController');

router.post('/shorten', verifyToken, shorten);
router.get('/my-links', verifyToken, getUserLinks);
router.get('/my-links/export', verifyToken, exportUserLinksCSV);
router.get('/link/:code', redirect);

module.exports = router;
