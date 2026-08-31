const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

// Публичные (без JWT) — см. authMiddleware PUBLIC_API_ROUTES
// Фаза 1: регистрация всегда создаёт role=student
router.post('/', userController.createUser);
router.post('/login', userController.loginUser);

router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.post('/logout', userController.logoutUser);

router.get('/', userController.getAllUsers);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.get('/:id', userController.getUserById);

module.exports = router;
