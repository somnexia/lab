# Пользователи и роли (LIMS)

Информационная система управления лабораторным инвентарём и исследованиями (`lab`).  
Ролей: **4**. Tenant: **лаборатория** (`laboratory_id` ← `employees.lab_id`).

Контракт: [README.md](./README.md). Матрица: [04-crud-matrix.md](./04-crud-matrix.md).

---

## Демо-учётные записи (фаза 1)

Пароль: `Password123!`

| Роль | Email | employee → lab |
|------|-------|----------------|
| system_admin | system.admin@lab.local | нет (`laboratory_id` будет null) |
| lab_admin | lab.admin@lab.local | employee 5 → lab 1 |
| researcher | researcher@lab.local | employee 1 → lab 1 |
| student | student@lab.local | employee 4 → lab 4 |

Сидер: `server/seeders/20260831190500-seed-role-demo-users.js`

---

## Сводная таблица ролей

| Код в БД | Роль | Описание | Основные полномочия |
|----------|------|----------|---------------------|
| `system_admin` | Системный администратор | Полный доступ к системе | Все лаборатории, пользователи, журнал (`logs`), любые CRUD |
| `lab_admin` | Администратор лаборатории | Руководитель одной лаборатории | CRUD в рамках своей `laboratory_id`: склад, оборудование, сотрудники, исследования |
| `researcher` | Исследователь | Ведёт исследования и задачи | CRUD researches/tasks в своей lab / команде; **чтение** склада и оборудования |
| `student` | Студент | Минимальные привилегии | Чтение каталогов; создание/изменение **своих** задач; профиль; роль по умолчанию при регистрации |

Роли `equipment_manager` и `technician` из проекта booking **не используются**: управление оборудованием и складом входит в полномочия `lab_admin`.

---

## Детализация

### system_admin

- Создание и удаление лабораторий.
- Управление пользователями любой роли и любой lab.
- Доступ к `/management/userlog` и API `/api/logs`.
- В JWT: `laboratory_id = null` (без tenant-фильтра в сервисах).

### lab_admin

- Пользователи и employees **своей** лаборатории.
- CRUD inventory, storages, storage units, equipment в своей lab.
- Исследования и задачи в своей lab.
- Не видит данные других лабораторий.
- Смена роли пользователя — в пределах своей lab; назначение `system_admin` — только у system_admin (правило сервиса).

### researcher

- Создание и ведение researches / tasks / experiments в своей lab.
- Участие в research teams.
- Просмотр склада и оборудования без деструктивных операций (по матрице — R).
- Нет доступа к журналу аудита.

### student

- Регистрация выдаёт эту роль.
- Просмотр (R) справочников и складов своей lab.
- Задачи: C/U только своих (assignee / автор); researches — преимущественно R.
- Нет управления пользователями, складом, оборудованием, логами.

---

## Соответствие в коде

| Артефакт | Статус |
|----------|--------|
| `server/config/roles.js` | фаза 2: `ROLES`, `CAN_*`, `hasRole` / `isSystemAdmin` |
| JWT payload | фаза 3: `role`, `laboratory_id` |
| `authenticate` / Cookie | фаза 4 |
| `authorize(CAN_*)` | фазы 4–6 |
| Client `navPerms` | фаза 7 |

