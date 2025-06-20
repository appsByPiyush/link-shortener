const db = require('../config/db');

const findUserByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

const createUser = async (email, password) => {
  await db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, password]);
};

module.exports = {
  findUserByEmail,
  createUser,
};
