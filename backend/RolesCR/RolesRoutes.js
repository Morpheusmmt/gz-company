
const express = require('express');
const router = express.Router();
const rolesController = require('./RolesController');

router.post('/', rolesController.createRole);                    
router.get('/', rolesController.getAllRoles);                    
router.get('/:id', rolesController.getRoleById);               
router.get('/nome/:nome', rolesController.getRoleByName);    
router.put('/:id', rolesController.updateRole);                  
router.delete('/:id', rolesController.deleteRole);               
router.patch('/:id/ativar', rolesController.activateRole);      

module.exports = router;