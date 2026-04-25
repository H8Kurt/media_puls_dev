require('dotenv').config();

const app = require('./app');
const { initModels } = require('./models');

const PORT = Number(process.env.PORT) || 4000;

const startServer = async () => {
  try {
    await initModels();
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
