const express = require('express');
const router = express.Router();

const userController = require("../controllers/userController");

// Маршрут для создания пользователя
router.post('/', userController.createUser);

// Маршрут для получения всех пользователей
router.get('/', userController.getAllUsers);



// Маршрут для обновления пользователя по ID
router.put('/:id', userController.updateUser);

// Маршрут для удаления пользователя по ID
router.delete('/:id', userController.deleteUser);

router.post('/login', userController.loginUser);

router.get('/profile', userController.getProfile);

router.post('/logout', userController.logoutUser);

router.get('/:id', userController.getUserById);



module.exports = router;
