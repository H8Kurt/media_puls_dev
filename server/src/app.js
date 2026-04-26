const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const exportRoutes = require('./routes/exportRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api', postRoutes);
app.use('/api/export', exportRoutes);


module.exports = app;
