const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const urlRoutes = require('./routes/urlRoutes');
const adminRoutes = require('./routes/adminRoutes');
const verifyToken = require('./middleware/authMiddleware');

const app = express();
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Hello from Node.js');
});
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/url', urlRoutes);


app.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'Accessed protected route', user: req.user });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
