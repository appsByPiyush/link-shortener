const crypto = require('crypto');
const dayjs = require('dayjs');

const algorithm = 'aes-256-cbc';
const secretKey = process.env.ENCRYPTION_SECRET_KEY; // Must be 32 chars
const iv = Buffer.alloc(16, 0); // Initialization vector (for simplicity, static zeroed IV)

const encrypt = (text) => {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
  let encrypted = cipher.update(String(text), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

const decrypt = (encrypted) => {
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};
const formatDate = (timestamp) => dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss');
module.exports = {
  encrypt,
  decrypt,
  formatDate
};