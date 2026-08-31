# CRUD-матрица доступа (LIMS)

Проект: **Laboratory Inventory Management System** (`lab`).  
Субъекты: **4 роли**. Tenant: **`laboratory_id`**.

Связанные документы: [README.md](./README.md) (контракт), [02-users-and-roles.md](./02-users-and-roles.md).  
Центр прав в коде (план): `server/config/roles.js`.

Это **черновик фазы 0** — уточняется при навешивании `authorize` и scope в сервисах.

---

## Условные обозначения

| Символ | Значение |
|--------|----------|
| **C** | Create |
| **R** | Read |
| **U** | Update (все обычные поля) |
| **U\*** | Update частичный (ограниченные поля) |
| **D** | Delete |
| **—** | Нет доступа |
| **ᴏ** | Только своя лаборатория (`laboratory_id` / цепочка до lab) |
| **ˢ** | Только свои записи (`user_id` / assignee / автор) |
| **Cᴏ Uᴏ Dᴏ** | Операция в рамках своей lab |
| **Cˢ Uˢ** | Операция только над своими записями |

> **Область видимости:** все роли, кроме `system_admin`, работают в пределах своей `laboratory_id`, если не указано иное (`ˢ`).

---

## Сводная матрица

| Сущность / область | system_admin | lab_admin | researcher | student |
|--------------------|:------------:|:---------:|:----------:|:-------:|
| **laboratories** | CRUD | Rᴏ Uᴏ* | Rᴏ | Rᴏ |
| **users** | CRUD | CRUDᴏ | Rˢ Uˢ | Rˢ Uˢ |
| **employees** | CRUD | CRUDᴏ | Rᴏ | Rᴏ |
| **researches** | CRUD | CRUDᴏ | CRUDᴏ† | Rᴏ (C/U — по участию, ограничено) |
| **tasks** / **task_files** | CRUD | CRUDᴏ | CRUDᴏ† | Cˢ Rᴏ Uˢ |
| **research employees / teams** | CRUD | CRUDᴏ | RUᴏ‡ | Rᴏ |
| **experiments** (+ I/O) | CRUD | CRUDᴏ | CRUDᴏ† | Rᴏ |
| **chemstorages** | CRUD | CRUDᴏ | Rᴏ | Rᴏ |
| **storageunits** | CRUD | CRUDᴏ | Rᴏ | Rᴏ |
| **inventories** (лоты) | CRUD | CRUDᴏ | Rᴏ | Rᴏ |
| **reagents / mixtures** (справочники) | CRUD | CRUDᴏ | Rᴏ | Rᴏ |
| **chemequipments** | CRUD | CRUDᴏ | Rᴏ | Rᴏ |
| **carts / orders** | CRUD | CRUDᴏ§ | Cˢ Rˢ Uˢ | Cˢ Rˢ Uˢ |
| **logs** | CRUD | Rᴏ‖ | — | — |

\* lab_admin: обновление **своей** лаборатории (name, location, …); **не** создаёт и **не** удаляет лаборатории (это system_admin).  
† в своей lab и/или как участник / владелец research.  
‡ researcher может вести состав своей команды исследования; удаление участников — по политике lab_admin/system_admin.  
§ lab_admin может просматривать заказы пользователей своей lab.  
‖ опционально в v1; допустимый минимум: logs только у `system_admin`.

---

## Детализация по сущностям

### 1. `laboratories` — tenant-корень

| Операция | system_admin | lab_admin | researcher / student |
|----------|--------------|-----------|----------------------|
| C | Да | — | — |
| R | Все | Своя | Своя |
| U | Все | Своя | — |
| D | Да | — | — |

**Изоляция:** для не-admin фильтр `id = req.user.laboratory_id`.

---

### 2. `users`

| Операция | system_admin | lab_admin | researcher / student |
|----------|--------------|-----------|----------------------|
| C | Любая роль, любая lab | Своя lab; роли кроме `system_admin` | Саморегистрация → только `student` |
| R | Все | Пользователи своей lab | Свой профиль |
| U | Все поля, вкл. `role` | Пользователи своей lab (не выдаёт `system_admin`) | Свой профиль **без** смены `role` |
| D | Да | Пользователи своей lab | — |

**Tenant:** через `employee.lab_id` или кэш `laboratory_id` в JWT/профиле.

---

### 3. `employees`

| Операция | system_admin | lab_admin | researcher / student |
|----------|--------------|-----------|----------------------|
| C/U/D | Все | Своя lab (`lab_id`) | — |
| R | Все | Своя lab | Своя lab (список участников) |

---

### 4. `researches`, `tasks`, `task_files`, teams

| Операция | system_admin | lab_admin | researcher | student |
|----------|--------------|-----------|------------|---------|
| C | Да | Своя lab | Своя lab | Задачи — свои; research — ограничено / через участие |
| R | Все | Своя lab | Своя lab / свои teams | Своя lab (read), свои tasks |
| U/D | Да | Своя lab | Свои / командные в lab | Только свои tasks (U); D — обычно нет или только свои черновики |

**Цепочка tenant:** research → `researchemployees` → `employees.lab_id`; task → research / assignee user → employee.

---

### 5. Storage & inventory

Таблицы: `chemstorages`, `storageunits`, `inventories`, `inventorystorageunits`, reagents/mixtures.

| Операция | system_admin | lab_admin | researcher / student |
|----------|--------------|-----------|----------------------|
| C/U/D | Да | Своя lab | — |
| R | Все | Своя lab | Своя lab |

**Цепочка:** `inventories` / units → `chemstorages.laboratory_id`.

---

### 6. `chemequipments` (+ элементы справочника)

| Операция | system_admin | lab_admin | researcher / student |
|----------|--------------|-----------|----------------------|
| C/U/D | Да | В рамках политики lab (каталог/привязки) | — |
| R | Да | Своя область | R |

Если у оборудования нет прямого `laboratory_id`, в первой волне: mutating — только admin-роли; read — всем аутентифицированным с учётом lab там, где связь появится.

---

### 7. `experiments` (+ inputs/outputs/consumptions)

| Операция | system_admin | lab_admin | researcher | student |
|----------|--------------|-----------|------------|---------|
| C/U/D | Да | Своя lab (`experiments.laboratory_id`) | Своя lab / связанный research | R (или свои учебные — по политике) |
| R | Да | Своя lab | Своя lab | Своя lab |

---

### 8. `carts`, `orders`

| Операция | system_admin | lab_admin | researcher / student |
|----------|--------------|-----------|----------------------|
| C/U | Да | Своя lab / свои | Только свои (`user_id`) |
| R | Да | Своя lab | Свои |
| D | Да | По политике | Свои черновики корзины |

---

### 9. `logs` (аудит)

| Операция | system_admin | lab_admin | researcher / student |
|----------|--------------|-----------|----------------------|
| R | Все | Опционально: события users своей lab | — |
| C | Система (сервис аудита) | — | — |
| U/D | Только system_admin (редко нужно) | — | — |

**API:** `GET /api/logs` → `authorize(CAN_VIEW_LOGS)`.

---

## Соответствие UI (черновик navPerms)

| Флаг (пример) | Роли |
|---------------|------|
| `showAdminLogs` | system_admin (, lab_admin) |
| `showUserAdmin` | system_admin, lab_admin |
| `showInventoryManage` | system_admin, lab_admin |
| `showStorageManage` | system_admin, lab_admin |
| `showEquipmentManage` | system_admin, lab_admin |
| `showResearchCreate` | system_admin, lab_admin, researcher |
| `showCatalogRead` | все 4 |

Точные имена констант — в `roles.js` / `navPerms.js` на фазе клиента.

---

## API (ориентир для authorize)

| Область | Пример ограничения |
|---------|-------------------|
| `GET/POST /api/logs` | `CAN_VIEW_LOGS` / только admin |
| `POST/PUT/DELETE` users (не profile) | `CAN_MANAGE_USERS` |
| Mutating inventory/storage/equipment | `CAN_MANAGE_INVENTORY` и аналоги |
| Mutating researches/tasks | `CAN_MANAGE_RESEARCH` + проверки «свои» для student |
| Все `/api/*` кроме login/register | `authenticate` (Cookie \|\| Bearer) |

---

## Draw.io

Визуальная таблица: **[diagrams/crud-matrix.drawio](./diagrams/crud-matrix.drawio)**  
Открыть в diagrams.net → при необходимости Export PNG/PDF для пояснительной.

Текст ниже — источник правды; при расхождении править сначала markdown, затем диаграмму.
