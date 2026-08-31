# Auth, роли и tenant — контракт LIMS (`lab`)

Документ **фазы 0** (до кода): зафиксированные условия внедрения системы ролей и прав.  
Источник паттерна: `lab-equipment-booking-saas` (только auth/roles/grants pattern, без booking-логики).  
Связанные файлы: [02-users-and-roles.md](./02-users-and-roles.md), [04-crud-matrix.md](./04-crud-matrix.md).

---

## 1. Зафиксированные решения

| Тема | Решение |
|------|---------|
| Роли (4) | `system_admin`, `lab_admin`, `researcher`, `student` |
| Не внедряем | `equipment_manager`, `technician` (их полномочия у `lab_admin`) |
| Tenant | **`laboratory_id`** (= `employees.lab_id` на момент логина) |
| `system_admin` и tenant | `laboratory_id = null` → доступ ко **всем** лабораториям |
| Остальные роли | только данные своей лаборатории (где есть связь с lab) |
| Auth | JWT: **Cookie + Bearer** (authenticate читает оба) |
| Центр прав (план) | `server/config/roles.js` — массивы `CAN_*` |
| UI | React: `user.role` → `navPerms` (аналог optionalUser, без Jade) |
| Регистрация | роль по умолчанию — `student` |

---

## 2. Правило изоляции (tenant)

```
system_admin  → без фильтра по laboratory_id
lab_admin /
researcher /
student       → только своя laboratory_id
```

**Прямая связь с lab:** `laboratories`, `employees.lab_id`, `chemstorages.laboratory_id`, `experiments.laboratory_id`.

**Через цепочку** (нет колонки на таблице):

| Сущность | Как резать по lab |
|----------|-------------------|
| `storageunits` | unit → `chemstorages.laboratory_id` |
| `inventories` / лоты | через storage unit / storage |
| `tasks`, `task_files` | research → участники (`researchemployees` → `employees.lab_id`) и/или assignee |
| `research` | участники команды / создатель с employee.lab_id |
| `carts`, `orders` | свой `user_id` (+ lab_admin видит заказы своей lab при необходимости) |
| `logs` | system_admin — все; lab_admin — действия пользователей своей lab (если реализуемо) |

Клиентские скрытия меню **не** заменяют проверки на API.

---

## 3. Что выяснилось в ходе анализа

### Текущий `lab` (до внедрения ролей)

- Есть **bcrypt** и **JWT Bearer** (`localStorage`), глобальный `protectApiRoutes`.
- В JWT сейчас только `{ id, email }` — **нет** `role` и `laboratory_id`.
- У `User` **нет** поля `role`; связь с lab косвенная: `User → Employee → lab_id`.
- Есть сущность **`laboratories`** и уже используемые FK (`chemstorages`, `experiments`, `employees`) — это готовая ось tenant (**вариант B**), без новой таблицы `organizations`.
- UI: `AuthContext` + `ProtectedRoute` — только «вошёл / не вошёл», без ролей.
- Домен — **LIMS** (inventory, storage, research, equipment, logs), не бронирование оборудования.

### Что брать из `lab-equipment-booking-saas`

| Брать | Не копировать |
|-------|----------------|
| `roles.js` + `CAN_*` | 6 ролей, booking `CAN_*` |
| `authenticate` + `authorize` | Jade / `res.locals` |
| JWT с ролью (+ tenant id) | модель `organizations` «как SaaS» |
| Документы ролей + CRUD-матрица | booking Use Case и матрицу 1:1 |
| Cookie+Bearer в authenticate | обязательный cookie-only без Bearer |
| (позже) урезанный grants.sql | полный SQL booking-процедур |

### Риски / пробелы

- Не у всех таблиц есть `laboratory_id` — нужен единый helper scope в сервисах.
- Пользователь без `employee_id` / без `lab_id` не получит нормальный tenant (кроме `system_admin`) — в сидах и регистрации это нужно учесть.
- Cookie для SPA — дополнение к Bearer, не замена (совместимость с текущим клиентом).

---

## 4. Краткая матрица доступа

Полная версия с цепочками и API: **[04-crud-matrix.md](./04-crud-matrix.md)**.

| Сущность | system_admin | lab_admin | researcher | student |
|----------|:------------:|:---------:|:----------:|:-------:|
| laboratories | CRUD | Rᴏ Uᴏ* | Rᴏ | Rᴏ |
| users | CRUD | CRUDᴏ | Rˢ Uˢ | Rˢ Uˢ |
| employees | CRUD | CRUDᴏ | Rᴏ | Rᴏ |
| researches / tasks | CRUD | CRUDᴏ | CRUDᴏ† | Cˢ R Uˢ |
| inventories / storages | CRUD | CRUDᴏ | Rᴏ | Rᴏ |
| equipment | CRUD | CRUDᴏ | Rᴏ | Rᴏ |
| logs | CRUD | Rᴏ‡ | — | — |

\* lab_admin не создаёт/не удаляет чужие лаборатории.  
† в рамках своей lab / участия в research.  
‡ опционально в первой волне; минимум — только system_admin.

Обозначения: **ᴏ** = своя организация/лаборатория, **ˢ** = только свои записи, **—** = нет доступа.

---

## 5. Что делать дальше (порядок реализации)

1. **БД:** миграция `users.role` (ENUM × 4, default `student`) + сиды 4 демо-аккаунтов с привязкой к employee/lab.  
2. **`server/config/roles.js`:** `ROLES`, `ROLE_LABELS`, `CAN_*` под LIMS.  
3. **JWT:** в payload `id`, `email`, `role`, `laboratory_id`; login резолвит lab из `employee.lab_id`.  
4. **Cookie + Bearer:** `cookie-parser`, Set-Cookie при login, clear при logout; `authenticate` читает cookie → иначе Bearer; добавить `authorize`.  
5. **Tenant helper** + фильтр на 1–2 доменах (laboratories / storages), затем расширять.  
6. **authorize на API** по риску: logs → users → labs → inventory/storage/equipment → research/tasks.  
7. **Клиент:** `navPerms`, RoleRoute для admin-экранов, роль в профиле.  
8. **Документы:** уточнить матрицу после кода; опционально `grants.sql` для раздела БД в дипломе.

Коммиты удобно дробить по этому списку (1 коммит ≈ 1 пункт).

---

## 6. Какие диаграммы важнее всего для описания проекта

Готовые файлы для draw.io: **[diagrams/](./diagrams/)**  
Открыть в [diagrams.net](https://app.diagrams.net) → Open Existing Diagram.

| Файл | Содержание |
|------|------------|
| [diagrams/erd-tenant.drawio](./diagrams/erd-tenant.drawio) | ERD: данные и tenant |
| [diagrams/use-case-roles.drawio](./diagrams/use-case-roles.drawio) | Use Case: 4 роли |
| [diagrams/crud-matrix.drawio](./diagrams/crud-matrix.drawio) | CRUD-матрица (визуал) |
| [diagrams/sequence-auth.drawio](./diagrams/sequence-auth.drawio) | Sequence: login → API |

Для диплома / пояснительной по **этому** LIMS приоритет такой:

| Приоритет | Диаграмма | Зачем |
|-----------|-----------|--------|
| **1** | **ERD** (логическое) | Ядро: users–employees–laboratories, storage/inventory, research–tasks–experiments. Показывает tenant (`lab_id` / `laboratory_id`) и связи, по которым строится изоляция. |
| **2** | **Use Case** | Акторы = 4 роли; кейсы: вход, управление складом, исследования, журнал. Прямо стыкуется с матрицей CRUD. |
| **3** | **CRUD-матрица** (таблица / draw.io) | Черновик в `04-crud-matrix.md` + визуал в `diagrams/crud-matrix.drawio`. |
| **4** | **Диаграмма компонентов / развёртывания** | Client (React :3001) ↔ API (Express :3000) ↔ MySQL; JWT Cookie+Bearer. |
| **5** | **Sequence: Login + запрос API** | Login → JWT/cookie → `authenticate`/`authorize` → сервис с фильтром `laboratory_id`. |
| **6** | **Activity / state** (по желанию) | Жизненный цикл research/task или лота inventory — если в ТЗ есть процессы. |

**Use Case vs ERD:** оба нужны, но для *разных* глав.  
- Use Case — «кто что может» (роли, границы системы).  
- ERD — «как устроены данные и tenant».  

**Не обязательно** на первом этапе: полная BPMN, C4 Level 3 на каждый модуль, копирование booking-диаграмм.

Рекомендуемый минимум в пояснительную: **ERD + Use Case (4 актора) + CRUD-матрица + 1 sequence (auth)**.

---

## 7. Проверка фазы 0 (готовность к коду)

- [x] 4 роли зафиксированы  
- [x] Tenant = `laboratory_id` / `employees.lab_id`  
- [x] Cookie + Bearer согласованы  
- [x] Черновик CRUD-матрицы написан  
- [x] Правило изоляции system_admin vs остальные описано  
- [x] Фаза 1 (код): миграция `users.role`, модель, сидер демо, регистрация → student
  - migrate: `npx sequelize-cli db:migrate`
  - seed демо: `npx sequelize-cli db:seed --seed 20260831190500-seed-role-demo-users.js`
  - пароль демо: `Password123!` (system.admin@lab.local, lab.admin@lab.local, researcher@lab.local, student@lab.local)
