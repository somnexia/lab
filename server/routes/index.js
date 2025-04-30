const express = require("express");
const router = express.Router();

const chemElementRoutes = require("./chemElementRoutes"); // Путь к маршрутам для элементов
const chemCompoundRoutes = require("./chemCompoundRoutes"); // Путь к маршрутам для соединений
const chemEquipmentRoutes = require("./chemEquipmentRoutes"); // Путь к маршрутам для оборудования
const chemMixtureRoutes = require("./chemMixtureRoutes"); // Путь к маршрутам для смесей
const laboratoryRoutes = require("./laboratoryRoutes"); // Путь к маршрутам для лабораторий
const researchRoutes = require("./researchRoutes"); // Путь к маршрутам для исследований
const chemStorageRoutes = require("./chemStorageRoutes"); // Путь к маршрутам для хранилищ
const employeeRoutes = require("./employeeRoutes"); // Путь к маршрутам для сотрудников
const experimentRoutes = require("./experimentRoutes"); // Путь к маршрутам для экспериментов
const inventoryRoutes = require("./inventoryRoutes"); // Путь к маршрутам для инвентаря
const storageUnitRoutes = require("./storageUnitRoutes");
const inventoryStorageUnitRoutes = require('./inventoryStorageUnitRoutes');
const cartRoutes =require("./cartRoutes")
const addRoutes = require("./add");
const addPricingRoutes = require("./addPricing");
const cardRoutes = require("./card");
const coursesRoutes = require("./courses");
const pricingRoutes = require("./pricings");
const homeRoutes = require("./home");
const userRoutes =  require("./userRoutes");
const taskRoutes = require('./taskRoutes');
const taskFileRouter = require('./taskFileRoutes');
const researchEmployeeRoutes = require('./researchEmployeeRoutes');
const orderRoutes = require('./orderRoutes'); // Путь к маршрутам для заказов
const logRoutes = require('./logRoutes'); // Путь к маршрутам для логов

router.use("/api/chemElements", chemElementRoutes); // Подключаем маршруты для элементов
router.use("/api/chemCompounds", chemCompoundRoutes); // Подключаем маршруты для соединений
router.use("/api/chemEquipments", chemEquipmentRoutes); // Подключаем маршруты для оборудования
router.use("/api/chemMixtures", chemMixtureRoutes); // Подключаем маршруты для смесей
router.use("/api/laboratories", laboratoryRoutes); // Подключаем маршруты для лабораторий
router.use("/api/researches", researchRoutes); // Подключаем маршруты для исследований
router.use("/api/storages", chemStorageRoutes); // Подключаем маршруты для хранилищ
router.use("/api/employees", employeeRoutes); // Подключаем маршруты для сотрудников
router.use("/api/experiments", experimentRoutes); // Подключаем маршруты для экспериментов
router.use("/api/inventories", inventoryRoutes); // Подключаем маршруты для инвентаря
router.use("/api/storageUnits", storageUnitRoutes);
router.use('/api/inventoryStorageUnit', inventoryStorageUnitRoutes);
router.use("/api/carts",cartRoutes);
router.use("/api/users", userRoutes);
router.use('/api/tasks', taskRoutes);
router.use("/add", addRoutes);
router.use("/addPricing", addPricingRoutes);
router.use("/card", cardRoutes);
router.use("/courses", coursesRoutes);
router.use("/pricings", pricingRoutes); 
router.use("/", homeRoutes);
router.use('/api/taskFiles', taskFileRouter);
router.use('/api/researchEmployees', researchEmployeeRoutes);
router.use('/api/orders', orderRoutes); // Подключаем маршруты для заказов
router.use('/api/logs', logRoutes); // Подключаем маршруты для логов

module.exports = router;