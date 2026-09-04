const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { authorize } = require('../middleware/authMiddleware');
const { CAN_MANAGE_USERS } = require('../config/roles');

// Публичные (без JWT) — PUBLIC_API_ROUTES в authMiddleware
router.post('/', userController.createUser);
router.post('/login', userController.loginUser);

// Любой аутентифицированный (глобальный authenticate)
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.post('/logout', userController.logoutUser);

// Фаза 4: список/CRUD пользователей — только CAN_MANAGE_USERS
router.get('/', authorize(CAN_MANAGE_USERS), userController.getAllUsers);
router.put('/:id', authorize(CAN_MANAGE_USERS), userController.updateUser);
router.delete('/:id', authorize(CAN_MANAGE_USERS), userController.deleteUser);
router.get('/:id', authorize(CAN_MANAGE_USERS), userController.getUserById);

module.exports = router;
