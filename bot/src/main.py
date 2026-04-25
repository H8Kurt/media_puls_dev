import asyncio
import logging
from aiogram import Bot, Dispatcher
from aiogram.client.session.aiohttp import AiohttpSession
from aiohttp import web

from src.config import BOT_TOKEN, WEB_SERVER_HOST, WEB_SERVER_PORT, PROXY_URL
from src.handlers import router
from src.api_server import create_app

from aiogram.client.telegram import TelegramAPIServer

async def main():
    # Настройка логирования
    logging.basicConfig(level=logging.INFO)

    # Используем альтернативный сервер API для обхода блокировок
    session = AiohttpSession(
        api=TelegramAPIServer.from_base("https://api.tgproxy.me")
    )

    bot = Bot(token=BOT_TOKEN, session=session)
    dp = Dispatcher()
    dp.include_router(router)

    logging.info("Starting Telegram bot...")
    try:
        await dp.start_polling(bot)
    finally:
        await bot.session.close()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except (KeyboardInterrupt, SystemExit):
        logging.info("Bot stopped")