const axios = require('axios');

exports.improveText = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Текст не предоставлен' });

    const authData = process.env.AI_API_KEY;
    const apiBase = process.env.AI_API_BASE;
    const isGigaChat = apiBase.includes('sberbank.ru');

    if (!authData) return res.json({ improvedText: text + '\n\n(AI: Добавьте AI_API_KEY)' });

    let token = authData;
    const https = require('https');
    const agent = new https.Agent({ rejectUnauthorized: false });

    // Если это GigaChat, сначала получаем временный access_token
    if (isGigaChat) {
      try {
        const { v4: uuidv4 } = require('uuid');
        const authResponse = await axios.post('https://ngw.devices.sberbank.ru:9443/api/v2/oauth', 
          'scope=GIGACHAT_API_PERS', 
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json',
              'RqUID': uuidv4(),
              'Authorization': `Basic ${authData}`
            },
            httpsAgent: agent
          }
        );
        token = authResponse.data.access_token;
      } catch (authError) {
        console.error('GigaChat Auth Detailed Error:', authError.response?.data || authError.message);
        return res.status(500).json({ 
          error: 'Ошибка авторизации в GigaChat', 
          details: authError.response?.data || authError.message 
        });
      }
    }

    const response = await axios.post(`${apiBase}/chat/completions`, {
      model: isGigaChat ? "GigaChat" : "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Ты — профессиональный редактор. Улучши текст поста для соцсетей. Верни только текст."
        },
        {
          role: "user",
          content: text
        }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      httpsAgent: isGigaChat ? agent : undefined
    });

    const improvedText = response.data.choices[0].message.content.trim();
    res.json({ improvedText });

  } catch (error) {
    console.error('AI Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Ошибка при обработке текста нейросетью' });
  }
};
