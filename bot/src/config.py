import os
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN", "YOUR_BOT_TOKEN_HERE")
CHANNEL_ID = os.getenv("CHANNEL_ID", "@your_channel")  # ID канала для публикации
WEBSITE_API_URL = os.getenv("WEBSITE_API_URL", "https://your-site.com/api/moderation")
API_SECRET_KEY = os.getenv("API_SECRET_KEY", "super-secret-key") # Для проверки запросов от сайта
PROXY_URL = os.getenv("PROXY_URL") # Например, http://proxy_addr:port
WEB_SERVER_HOST = "0.0.0.0"
WEB_SERVER_PORT = 8080