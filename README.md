# WB Tariffs Service

Сервис для регулярного получения тарифов Wildberries и записи в PostgreSQL + Google Sheets.

## Что делает

- Каждый час получает тарифы на короба с WB API
- Сохраняет/обновляет данные в PostgreSQL (одна запись на склад на день)
- Обновляет данные в N Google-таблицах (лист `stocks_coefs`), отсортированных по коэффициенту доставки

## Быстрый старт

### 1. Клонируй репозиторий
```bash
git clone https://github.com/vladonsikos/wb-tariffs-service.git
cd wb-tariffs-service
```

### 2. Настрой конфигурацию
```bash
cp .env.example .env
```

Открой `.env` и заполни:
- `WB_API_TOKEN` — токен Wildberries API
- `GOOGLE_SPREADSHEET_IDS` — ID Google таблиц через запятую

### 3. Добавь Google credentials

Создай сервисный аккаунт в Google Cloud Console, скачай JSON и сохрани как `google-credentials.json` в корень проекта.

Пример структуры файла — `google-credentials.example.json`.

Не забудь дать сервисному аккаунту доступ (Editor) к каждой Google таблице.

### 4. Запуск
```bash
docker compose up
```

Всё — миграции применяются автоматически, первый запрос к WB API происходит сразу при старте.

## Проверка работы
```bash
# Логи приложения
docker compose logs -f app

# Подключиться к БД и проверить данные
docker compose exec postgres psql -U postgres -c "SELECT warehouse_name, box_delivery_base, date FROM wb_box_tariffs ORDER BY box_delivery_base LIMIT 10;"
```

## Переменные окружения

| Переменная | Описание | Пример |
|---|---|---|
| `WB_API_TOKEN` | Токен WB API | `eyJhbGci...` |
| `DB_HOST` | Хост PostgreSQL | `postgres` |
| `DB_PORT` | Порт PostgreSQL | `5432` |
| `DB_NAME` | Имя БД | `postgres` |
| `DB_USER` | Пользователь БД | `postgres` |
| `DB_PASSWORD` | Пароль БД | `postgres` |
| `GOOGLE_SERVICE_ACCOUNT_PATH` | Путь к json ключу | `/app/google-credentials.json` |
| `GOOGLE_SPREADSHEET_IDS` | ID таблиц через запятую | `abc123,def456` |
| `CRON_SCHEDULE` | Cron расписание | `0 * * * *` |

## Структура таблицы `wb_box_tariffs`

| Поле | Тип | Описание |
|---|---|---|
| `warehouse_name` | string | Название склада |
| `box_delivery_and_storage_expr` | string | Выражение доставки+хранения |
| `box_delivery_base` | decimal | Базовая стоимость доставки |
| `box_delivery_liter` | decimal | Стоимость доставки за литр |
| `box_storage_base` | decimal | Базовая стоимость хранения |
| `box_storage_liter` | decimal | Стоимость хранения за литр |
| `date` | date | Дата тарифа |

Уникальный ключ: `(warehouse_name, date)` — данные за день обновляются, не дублируются.
