# MediaPuls Backend

Backend для регистрации пользователей на `Node.js + Express + Sequelize + PostgreSQL`.

## Требования

- Node.js 18+
- npm
- PostgreSQL 14+

## Установка PostgreSQL (CachyOS / Arch)

```bash
sudo pacman -S postgresql
sudo -u postgres initdb -D /var/lib/postgres/data
sudo systemctl enable --now postgresql
```

Создание БД и пользователя:

```bash
sudo -u postgres psql -c "CREATE USER media_puls WITH PASSWORD 'StrongPass123!';"
sudo -u postgres psql -c "CREATE DATABASE media_puls_dev OWNER media_puls;"
```

## Установка и запуск проекта

1. Перейти в папку backend:
   ```bash
   cd server
   ```

2. Установить зависимости:
   ```bash
   npm install
   ```

3. Создать `.env`:
   ```bash
   cp .env.example .env
   ```

4. Заполнить переменные окружения в `.env`.

5. Запустить сервер в dev-режиме:
   ```bash
   npm run dev
   ```

После старта сервер доступен на `http://localhost:4000`.

## Переменные окружения

Пример (`.env.example`):

```env
PORT=4000
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=media_puls_dev
DB_USER=media_puls
DB_PASSWORD=StrongPass123!
DB_DIALECT=postgres
```

## API

### Health check

- **GET** `/health`
- Ответ:
  ```json
  { "status": "ok" }
  ```

### Регистрация

- **POST** `/api/auth/register`
- Body (JSON):
  ```json
  {
    "email": "user@example.com",
    "password": "123456",
    "name": "Иван"
  }
  ```

#### Успешный ответ

- `201 Created`
- Пример:
  ```json
  {
    "message": "Регистрация успешна",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "Иван"
    }
  }
  ```

#### Возможные ошибки

- `400` — не заполнены обязательные поля
- `400` — пароль короче 6 символов
- `409` — пользователь с таким email уже существует
- `500` — внутренняя ошибка сервера

## Проверка через curl

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456","name":"Test"}'
```

## Примечания

- Таблица пользователей создаётся автоматически при запуске (`sequelize.sync()`).
- Используется таблица `users` в схеме `public`.
