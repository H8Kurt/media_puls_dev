const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const statsRoutes = require('./routes/statsRoutes');
const moderationRoutes = require('./routes/moderationRoutes');
const exportRoutes = require('./routes/exportRoutes');
const botRoutes = require('./routes/botRoutes'); // Добавляем

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/moderation', moderationRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/bot', botRoutes); // Регистрируем


module.exports = app;
