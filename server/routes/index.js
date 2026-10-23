const express = require("express");
const router = express.Router();
const { protectApiRoutes } = require("../middleware/authMiddleware");

// Все /api/* требуют JWT, кроме POST /api/users/login и POST /api/users (регистрация)
router.use(protectApiRoutes);

const chemElementRoutes = require("./chemElementRoutes");
const chemCompoundRoutes = require("./chemCompoundRoutes");
const chemEquipmentRoutes = require("./chemEquipmentRoutes");
const chemMixtureRoutes = require("./chemMixtureRoutes");
const laboratoryRoutes = require("./laboratoryRoutes");
const researchRoutes = require("./researchRoutes");
const chemStorageRoutes = require("./chemStorageRoutes");
const employeeRoutes = require("./employeeRoutes");
const experimentRoutes = require("./experimentRoutes");
const inventoryRoutes = require("./inventoryRoutes");
const reagentRoutes = require("./reagentRoutes");
const storageUnitRoutes = require("./storageUnitRoutes");
const inventoryStorageUnitRoutes = require("./inventoryStorageUnitRoutes");
const cartRoutes = require("./cartRoutes");
const userRoutes = require("./userRoutes");
const taskRoutes = require("./taskRoutes");
const taskFileRouter = require("./taskFileRoutes");
const researchEmployeeRoutes = require("./researchEmployeeRoutes");
const researchTeamRoutes = require("./researchTeamRoutes");
const orderRoutes = require("./orderRoutes");
const logRoutes = require("./logRoutes");

router.use("/api/chemElements", chemElementRoutes);
router.use("/api/chemCompounds", chemCompoundRoutes);
router.use("/api/chemEquipments", chemEquipmentRoutes);
router.use("/api/chemMixtures", chemMixtureRoutes);
router.use("/api/laboratories", laboratoryRoutes);
router.use("/api/researches", researchRoutes);
router.use("/api/storages", chemStorageRoutes);
router.use("/api/employees", employeeRoutes);
router.use("/api/experiments", experimentRoutes);
router.use("/api/inventories", inventoryRoutes);
router.use("/api/reagents", reagentRoutes);
router.use("/api/storageUnits", storageUnitRoutes);
router.use("/api/inventoryStorageUnit", inventoryStorageUnitRoutes);
router.use("/api/carts", cartRoutes);
router.use("/api/users", userRoutes);
router.use("/api/tasks", taskRoutes);
router.use("/api/taskFiles", taskFileRouter);
router.use("/api/researchEmployees", researchEmployeeRoutes);
router.use("/api/research-teams", researchTeamRoutes);
router.use("/api/orders", orderRoutes);
router.use("/api/logs", logRoutes);

module.exports = router;
