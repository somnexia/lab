const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { authorize } = require('../middleware/authMiddleware');
const {
  CAN_MANAGE_USERS,
  CAN_VIEW_OWN_PROFILE,
} = require('../config/roles');

// Публичные (без JWT) — PUBLIC_API_ROUTES в authMiddleware
router.post('/', userController.createUser);
router.post('/login', userController.loginUser);

/**
 * Фаза 6a: профиль явно через authorize(CAN_VIEW_OWN_PROFILE).
 * Глобальный authenticate уже отработал; authorize документирует контракт.
 */
router.get('/profile', authorize(CAN_VIEW_OWN_PROFILE), userController.getProfile);
router.put('/profile', authorize(CAN_VIEW_OWN_PROFILE), userController.updateProfile);
router.post('/logout', authorize(CAN_VIEW_OWN_PROFILE), userController.logoutUser);

/** Фаза 6a: админ создаёт учётку с ролью (не публичная регистрация) */
router.post(
  '/managed',
  authorize(CAN_MANAGE_USERS),
  userController.createManagedUser
);

// CRUD пользователей — CAN_MANAGE_USERS + tenant в сервисе (lab_admin = своя lab)
router.get('/', authorize(CAN_MANAGE_USERS), userController.getAllUsers);
router.put('/:id', authorize(CAN_MANAGE_USERS), userController.updateUser);
router.delete('/:id', authorize(CAN_MANAGE_USERS), userController.deleteUser);
router.get('/:id', authorize(CAN_MANAGE_USERS), userController.getUserById);

module.exports = router;
