# Custom CMS for Portfolio Websites

Това приложение представлява динамична CMS система за портфолиа, базирана на Node.js, Express и MongoDB, която използва JSON Schema за описание на типовете съдържание. Всички CRUD (Create, Read, Update, Delete) операции и API маршрути се генерират автоматично според наличните схеми.

## Функционалности

- **Динамично зареждане на схеми:** Всеки JSON файл в папка `schemas/` се зарежда автоматично и се създава съответен модел и API.
- **Вложени обекти:** Поддържа се вложена структура на данните (напр. поле `author` с подполета).
- **CRUD операции:** За всяка схема се създават автоматично маршрути за създаване, четене, редакция и изтриване.
- **Валидиране:** Всички заявки се валидират спрямо съответната JSON Schema чрез AJV.
- **Лесно разширяване:** Добавянето на нов тип съдържание става само чрез добавяне на нов JSON файл в `schemas/` и рестартиране на сървъра.

## Структура на проекта

```
.env
db.js
server.js
package.json
routes/
  dynamicRoutes.js
schemas/
  portfolio.json
utils/
  jsonSchemaToMongooseDef.js
  loadSchemas.js
```

## Инструкции за стартиране

1. **Клониране на репозиторито:**
   ```
   git clone https://github.com/ZohanBG/GDB.git
   cd GDB
   ```

2. **Инсталиране на зависимостите:**
   ```
   npm install
   ```

3. **Настройка на .env файл:**
   ```
   MONGO_URI=mongodb://localhost:27017/
   PORT=6969
   ```

4. **Стартиране на сървъра:**
   ```
   npm start
   ```

5. **Достъп до API:**
   - Пример: `POST /api/portfolio`
   - Пример: `GET /api/portfolio`

## Добавяне на нов тип съдържание

1. Създайте нов JSON файл в папка `schemas/` (например `blog.json`).
2. Опишете структурата на новия тип съдържание чрез JSON Schema.
3. Рестартирайте сървъра. Новите CRUD маршрути ще се появят автоматично.

## Пример за JSON Schema

```json
{
  "title": "Portfolio",
  "type": "object",
  "properties": {
    "title": { "type": "string" },
    "description": { "type": "string" },
    "features": {
      "type": "array",
      "items": { "type": "string" }
    },
    "author": {
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "id": { "type": "number" }
      },
      "required": ["name", "id"]
    },
    "tags": {
      "type": "array",
      "items": { "type": "string" }
    }
  },
  "required": ["title", "description", "author"]
}
```

**Целият изходен код е достъпен в това публично GitHub хранилище.**