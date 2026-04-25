import aiohttp
import aiohttp
from aiogram import Router, types, F, Bot
from aiogram.filters import Command
from aiogram.utils.keyboard import ReplyKeyboardBuilder
from src.config import WEBSITE_API_URL

router = Router()

async def send_to_site(endpoint: str, data: dict = None, method: str = "POST"):
    """Универсальная функция для связи с Node.js сервером"""
    url = f"{WEBSITE_API_URL.rstrip('/')}/api/bot/{endpoint.lstrip('/')}"
    try:
        async with aiohttp.ClientSession() as session:
            if method == "POST":
                async with session.post(url, json=data, timeout=10) as response:
                    return await response.json() if response.status in [200, 201] else None
            else:
                async with session.get(url, timeout=10) as response:
                    return await response.json() if response.status == 200 else None
    except Exception as e:
        print(f"Error connecting to server: {e}")
        return None

def get_main_keyboard():
    builder = ReplyKeyboardBuilder()
    builder.button(text="📝 Создать пост")
    builder.button(text="📊 Моя статистика")
    builder.button(text="ℹ️ Инструкция")
    builder.adjust(1, 2)
    return builder.as_markup(resize_keyboard=True)

@router.message(Command("start"))
async def cmd_start(message: types.Message):
    await message.answer(
        "Привет, волонтер! 👋\nЯ помогу тебе отправить контент на модерацию. Выбери действие в меню:",
        reply_markup=get_main_keyboard()
    )

@router.message(F.text == "ℹ️ Инструкция")
async def cmd_help(message: types.Message):
    await message.answer(
        "📖 Инструкция:\n1. Нажми 'Создать пост'\n2. Пришли текст и/или фото\n3. Дождись одобрения модератором.\n\nВсе посты попадают в общую очередь медиа-центра.",
        reply_markup=get_main_keyboard()
    )

@router.message(F.text == "📊 Моя статистика")
async def cmd_stats(message: types.Message):
    res = await send_to_site(f"stats/{message.from_user.id}", method="GET")
    count = res.get("count", 0) if res else 0
    await message.answer(f"📈 Твоя активность:\nВсего предложено постов: {count}", reply_markup=get_main_keyboard())

@router.message(F.text == "📝 Создать пост")
async def cmd_create(message: types.Message):
    await message.answer(
        "📝 Чтобы предложить пост:\n\n1. Прикрепите ФОТО (по желанию)\n2. Напишите ТЕКСТ поста в этом же сообщении или следующим.\n\nЯ сразу увижу твой материал! ✨",
        reply_markup=get_main_keyboard()
    )

@router.message(F.text | F.photo)
async def handle_suggestion(message: types.Message, bot: Bot):
    if message.text in ["📝 Создать пост", "📊 Моя статистика", "ℹ️ Инструкция"]:
        return

    text = message.text or message.caption or ""
    media_url = ""

    if message.photo:
        # Получаем прямую ссылку на фото через Telegram API
        file_id = message.photo[-1].file_id
        file = await bot.get_file(file_id)
        # В идеале Node.js должен сам скачать файл, но для теста передадим путь
        media_url = f"https://api.telegram.org/file/bot{bot.token}/{file.file_path}"

    data = {
        "telegramId": str(message.from_user.id),
        "authorName": message.from_user.full_name,
        "text": text,
        "mediaUrl": media_url
    }

    result = await send_to_site("suggest", data)
    
    if result and result.get("success"):
        await message.answer("✅ Принято! Твой материал отправлен на модерацию. Спасибо!", reply_markup=get_main_keyboard())
    else:
        await message.answer("❌ Ошибка при отправке. Попробуй позже.", reply_markup=get_main_keyboard())

    if message.photo:
        # Берем самое качественное фото
        data["image_file_id"] = message.photo[-1].file_id
        # В реальном проекте здесь стоит скачать файл и отправить на сайт сам файл или ссылку на него
    
    success = await send_to_site(data)
    
    if success:
        await message.answer("Спасибо! Ваш пост отправлен на модерацию.")
    else:
        await message.answer("Произошла ошибка при отправке на сайт. Попробуйте позже.")