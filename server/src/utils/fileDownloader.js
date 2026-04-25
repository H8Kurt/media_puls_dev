const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

/**
 * Скачивает файл по URL и сохраняет его в папку uploads
 * @param {string} url - Ссылка на файл
 * @returns {string} - Путь к сохраненному файлу (относительно корня сервера)
 */
async function downloadFile(url) {
  if (!url) return null;

  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    });

    const extension = url.split('.').pop().split(/[?#]/)[0] || 'jpg';
    const fileName = `${uuidv4()}.${extension}`;
    const uploadDir = path.join(__dirname, '../../uploads');
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);
    const writer = fs.createWriteStream(filePath);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(`/uploads/${fileName}`));
      writer.on('error', reject);
    });
  } catch (error) {
    console.error('Error downloading file:', error.message);
    return null;
  }
}

module.exports = { downloadFile };
