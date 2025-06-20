const db = require('../config/db');
const { encrypt, decrypt, formatDate } = require('../common/converter');
const { format } = require('@fast-csv/format');

exports.listUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  try {
    const [users] = await db.query(
      'SELECT id, email, created_at FROM users WHERE type = 2 ORDER BY created_at DESC LIMIT ? OFFSET ?',
       [limit, offset]
    );
    const [countRow] = await db.query(
      `SELECT COUNT(*) AS total FROM users WHERE type = 2`
    );
    // Encrypt ID before sending
    const encryptedUsers = users.map(user => ({
      ...user,
      id: encrypt(user.id),
      created_at: formatDate(user.created_at)
    }));
    res.json({
      page,
      limit,
      totalItems: countRow[0].total,
      totalPages: Math.ceil(countRow[0].total / limit),
      data: encryptedUsers,
      data2: decryptedUsers,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
};

exports.getUserLinksPaginated = async (req, res) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const [rows] = await db.query(
      `SELECT  short_code, original_url, click_count, expires_at, created_at FROM urls WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );
    const formatedUsers = rows.map(row => ({
      ...row,
      expires_at: formatDate(row.expires_at),
      created_at: formatDate(row.created_at),
    }));
    const [countRow] = await db.query(
      `SELECT COUNT(*) AS total FROM urls WHERE user_id = ?`,
      [userId]
    );

    res.json({
      userId,
      page,
      limit,
      totalItems: countRow[0].total,
      totalPages: Math.ceil(countRow[0].total / limit),
      data: formatedUsers,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching URLs', error: err.message });
  }
};
exports.exportUserLinksCSV = async (req, res) => {
  const { userId } = req.params;

  try {
    const [rows] = await db.query(
      'SELECT short_code, original_url, click_count, expires_at, created_at FROM urls WHERE user_id = ? ORDER BY created_at DESC LIMIT 10000',
      [userId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'No links found for this user' });
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="user_${userId}_links.csv"`
    );

    const csvStream = format({ headers: true });
    csvStream.pipe(res);

    rows.forEach((row) => {
      csvStream.write({
        ShortURL: `${req.protocol}://${req.get('host')}/link/${row.short_code}`,
        OriginalURL: row.original_url,
        Clicks: row.click_count,
        CreatedAt: formatDate(row.expires_at),
        ExpiresAt: formatDate(row.created_at) || '',
      });
    });

    csvStream.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error exporting CSV', error: err.message });
  }
};