from aiohttp import web
import json
from datetime import datetime

# Список для хранения полученных постов в памяти
received_posts = []

async def index(request):
    # Генерируем простую HTML страницу
    html_content = """
    <!DOCTYPE html>
    <html lang="ru">
    <head>
        <meta charset="UTF-8">
        <title>Панель модерации (Заглушка)</title>
        <style>
            body { font-family: sans-serif; margin: 20px; background: #f4f4f9; }
            .post { background: white; padding: 15px; margin-bottom: 10px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .post img { max-width: 300px; display: block; margin-top: 10px; border-radius: 4px; }
            .meta { color: #666; font-size: 0.9em; }
            h1 { color: #333; }
            .no-posts { color: #999; font-style: italic; }
        </style>
        <meta http-equiv="refresh" content="5"> <!-- Автообновление каждые 5 секунд -->
    </head>
    <body>
        <h1>Полученные посты на модерацию</h1>
        <div id="posts">
    """
    
    if not received_posts:
        html_content += "<p class='no-posts'>Постов пока нет...</p>"
    else:
        for post in reversed(received_posts):
            img_tag = f'<img src="{post.get("image_url")}" alt="Image">' if post.get("image_url") else ''
            html_content += f"""
            <div class="post">
                <div class="meta">От: {post.get('user_id')} | Время: {post.get('timestamp')}</div>
                <p><strong>Текст:</strong> {post.get('text', '(без текста)')}</p>
                {img_tag}
                <p><small>Action: {post.get('action')}</small></p>
            </div>
            """
    
    html_content += """
        </div>
    </body>
    </html>
    """
    return web.Response(text=html_content, content_type='text/html')

async def handle_moderation(request):
    try:
        data = await request.json()
        data['timestamp'] = datetime.now().strftime("%H:%M:%S")
        received_posts.append(data)
        
        print(f" [MOCK] Получен пост от пользователя {data.get('user_id')}")
        return web.json_response({"status": "ok"}, status=200)
    except Exception as e:
        return web.json_response({"status": "error", "message": str(e)}, status=400)

app = web.Application()
app.add_routes([
    web.get('/', index),
    web.post('/api/moderation', handle_moderation)
])

if __name__ == '__main__':
    print("Заглушка запущена!")
    print("Открыть в браузере: http://localhost:5000")
    web.run_app(app, port=5000)
