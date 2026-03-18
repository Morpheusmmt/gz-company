const express = require("express");
const router = express.Router();
const usersController = require("./UsersController");

// ROTA 6: Listar todas as roles
router.get("/roles", usersController.getRoles);

// ROTA 1: Listar todos os usuários
router.get("/", usersController.getUsers);

// ROTA 2: Buscar usuário por ID
router.get("/:id", usersController.getUserID);

// ROTA 3: Criar novo usuário
router.post("/", usersController.createUser);

// ROTA 4: Editar usuário
router.put("/:id", usersController.updateUser);

// ROTA 5: Deletar usuário
router.delete("/:id", usersController.deleteUser);

module.exports = router;