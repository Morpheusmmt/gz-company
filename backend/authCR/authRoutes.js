const express = require("express");
const router = express.Router();
const authController = require("./authController");
const authMiddleware = require("./authMiddleware");

// Rotas públicas (sem autenticação)
router.post("/api/register", authController.register);
router.post("/api/login", authController.login);
router.post("/api/forgot-password", authController.forgotPassword);
router.post("/api/reset-password", authController.resetPassword);

// Rotas protegidas (com autenticação)
router.put("/api/reset-password-logged", authMiddleware, authController.resetPasswordLogged);

module.exports = router;