const { nanoid } = require('nanoid');
const { format } = require('@fast-csv/format');
const { encrypt, decrypt, formatDate } = require('../common/converter');
const {
  createShortUrl,
  getOriginalUrl,
  incrementClickCount,
  getUserUrls,
  getUserUrlsPaginated
} = require('../models/urlModel');

exports.shorten = async (req, res) => {
  const { originalUrl, expiresInDays } = req.body;
  const userId = req.user.id;

  if (!originalUrl) return res.status(400).json({ message: 'Original URL is required' });

  const shortCode = nanoid(6);
  const expiresAt = expiresInDays
    ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
    : null;

  await createShortUrl(userId, shortCode, originalUrl, expiresAt);

  res.json({
    shortUrl: `${req.protocol}://${req.get('host')}/u/${shortCode}`,
    originalUrl,
    expiresAt,
  });
};

exports.redirect = async (req, res) => {
  const { code } = req.params;
  const record = await getOriginalUrl(code);

  if (!record) return res.status(404).send('Link expired or not found');

  await incrementClickCount(code);
  res.redirect(record.original_url);
};

// exports.getUserLinks = async (req, res) => {
//   const userId = req.user.id;
//   const urls = await getUserUrls(userId);
//   res.json(urls);
// };

exports.getUserLinks = async (req, res) => {
  const userId = req.user.id;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10; // Default 10 per page
  const offset = (page - 1) * limit;

  try {
    const { urls, total } = await getUserUrlsPaginated(userId, limit, offset);

    res.json({
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      data: urls,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch links', error: err.message });
  }
};

exports.exportUserLinksCSV = async (req, res) => {
  const userId = req.user.id;

  try {
    const { urls } = await getUserUrlsPaginated(userId, 10000, 0); // get all

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="my-links.csv"');

    const csvStream = format({ headers: true });
    csvStream.pipe(res);

    urls.forEach((row) => {
      csvStream.write({
        ID: row.id,
        ShortURL: `${req.protocol}://${req.get('host')}/u/${row.short_code}`,
        OriginalURL: row.original_url,
        Clicks: row.click_count,
        CreatedAt: formatDate(row.created_at),
        ExpiresAt: formatDate(row.expires_at) || '',
      });
    });

    csvStream.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error generating CSV' });
  }
};