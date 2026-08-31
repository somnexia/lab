# Диаграммы для draw.io

Файлы в формате **`.drawio`** — открываются напрямую в [diagrams.net](https://app.diagrams.net) / Desktop Draw.io.

Стиль: короткие подписи по-русски, без «корпоративного» перегруза.

| Файл | О чём |
|------|--------|
| [erd-tenant.drawio](./erd-tenant.drawio) | Данные и tenant: лаборатория в центре, цепочки до inventory/tasks |
| [use-case-roles.drawio](./use-case-roles.drawio) | 4 актёра (роли) и основные сценарии |
| [crud-matrix.drawio](./crud-matrix.drawio) | Визуальная CRUD-таблица (дубль [../04-crud-matrix.md](../04-crud-matrix.md)) |
| [sequence-auth.drawio](./sequence-auth.drawio) | Login → Cookie/Bearer → authorize → filter по lab |

## Как открыть / «импортировать»

1. Зайди на https://app.diagrams.net (или открой Draw.io Desktop).
2. **Open Existing Diagram** → выбери нужный `.drawio` из этой папки.  
   Либо перетащи файл в окно браузера.
3. Правь подписи под пояснительную.
4. **File → Export as → PNG / PDF** для вставки в Word/LaTeX.

Отдельно «импортировать XML» не нужно: `.drawio` уже родной формат.

## Подсказки по правке

- **ERD:** бирюзовые блоки = прямая связь с lab; серые = lab через цепочку.
- **Use Case:** цвет актёра совпадает с цветом его зоны на диаграмме.
- **CRUD:** зелёный = широкий доступ, жёлтый = только «свои», красноватый = нет доступа.
- **Sequence:** сверху вниз — логин, потом обычный API-запрос.

Контракт ролей: [../README.md](../README.md).
