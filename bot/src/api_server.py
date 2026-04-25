from aiohttp import web
from aiogram import Bot
from src.config import CHANNEL_ID, API_SECRET_KEY

async def create_app(bot: Bot):
    app = web.Application()
    app['bot'] = bot
    app.router.add_post('/publish', handle_publish)
    return app

async def handle_publish(request):
    # Проверка секретного ключа для безопасности
    auth_key = request.headers.get("X-API-Key")
    if auth_key != API_SECRET_KEY:
        return web.Response(status=403, text="Forbidden")

    try:
        data = await request.json()
        bot = request.app['bot']
        
        text = data.get("text")
        image_url = data.get("image_url") # Ссылка на изображение с вашего сайта

        if image_url:
            await bot.send_photo(CHANNEL_ID, photo=image_url, caption=text)
        else:
            await bot.send_message(CHANNEL_ID, text=text)
            
        return web.json_response({"status": "ok"})
    except Exception as e:
        return web.json_response({"status": "error", "message": str(e)}, status=400)