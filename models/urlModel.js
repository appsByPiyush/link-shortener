const db = require('../config/db');

const createShortUrl = async (userId, shortCode, originalUrl, expiresAt) => {
  const [result] = await db.query(
    'INSERT INTO urls (user_id, short_code, original_url, expires_at) VALUES (?, ?, ?, ?)',
    [userId, shortCode, originalUrl, expiresAt]
  );
  return result.insertId;
};

const getOriginalUrl = async (shortCode) => {
  const [rows] = await db.query(
    'SELECT * FROM urls WHERE short_code = ? AND (expires_at IS NULL OR expires_at > NOW())',
    [shortCode]
  );
  return rows[0];
};

const incrementClickCount = async (shortCode) => {
  await db.query('UPDATE urls SET click_count = click_count + 1 WHERE short_code = ?', [shortCode]);
};

const getUserUrls = async (userId) => {
  const [rows] = await db.query('SELECT * FROM urls WHERE user_id = ?', [userId]);
  return rows;
};
const getUserUrlsPaginated = async (userId, limit, offset) => {
  const [rows] = await db.query(
    `SELECT * FROM urls WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [userId, limit, offset]
  );

  const [countRows] = await db.query(
    `SELECT COUNT(*) as total FROM urls WHERE user_id = ?`,
    [userId]
  );

  return {
    urls: rows,
    total: countRows[0].total,
  };
};

module.exports = {
  createShortUrl,
  getOriginalUrl,
  incrementClickCount,
  getUserUrls,
  getUserUrlsPaginated
};
