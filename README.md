# English Club Web Application

Базовая структура проекта для веб-сайта с авторизацией и регистрацией пользователей.

## Архитектура проекта

```text
English club/
├── backend/                  # Серверная часть (API, авторизация, база данных)
│   ├── src/
│   │   ├── config/           # Конфигурации (подключение к БД, переменные)
│   │   ├── controllers/      # Контроллеры (логика обработки запросов)
│   │   ├── middlewares/      # Промежуточные обработчики (проверка JWT/сессий)
│   │   ├── models/           # Модели данных (User и др.)
│   │   ├── routes/           # Маршруты API
│   │   └── app.js            # Инициализация Express приложения
│   ├── .env.example          # Пример переменных окружения бэкенда
│   ├── package.json
│   └── server.js             # Точка входа сервера
│
├── frontend/                 # Клиентская часть (интерфейс)
│   ├── public/
│   ├── src/
│   │   ├── assets/           # Статика (картинки, иконки)
│   │   ├── components/       # Переиспользуемые компоненты (Navbar, Button и т.д.)
│   │   ├── context/          # Контекст состояния (AuthContext)
│   │   ├── pages/            # Страницы (Home, Login, Register, Profile)
│   │   ├── services/         # Клиент для API запросов
│   │   ├── styles/           # CSS стили
│   │   ├── App.jsx           # Главный компонент и роутинг
│   │   └── main.jsx          # Точка входа React
│   ├── index.html
│   └── package.json
│
├── .gitignore
└── README.md
```

## Быстрый старт

### Бэкенд
1. Перейдите в папку `backend`:
   ```bash
   cd backend
   npm install
   ```
2. Скопируйте `.env.example` в `.env` и настройте параметры.
3. Запустите сервер:
   ```bash
   npm run dev
   ```

### Фронтенд
1. Перейдите в папку `frontend`:
   ```bash
   cd frontend
   npm install
   ```
2. Запустите приложение:
   ```bash
   npm run dev
   ```
