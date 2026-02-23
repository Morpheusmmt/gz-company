const express = require("express");
const router = express.Router();
const authController = require("./authController");
const authMiddleware = require("./authMiddleware");


router.post("/api/register", authController.register);
router.post("/api/login", authController.login);
router.post("/api/forgot-password", authController.forgotPassword);
router.post("/api/reset-password", authController.resetPassword);

router.use("/api", authMiddleware);

router.put("/api/reset-password-logged", authController.resetPasswordLogged);

module.exports = router;