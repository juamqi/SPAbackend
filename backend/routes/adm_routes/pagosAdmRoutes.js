const express = require('express');
const router = express.Router();
const pagosAdmController = require('../../controllers/adm_controllers/pagosAdmController');

// GET /api/admin/pagos - Obtiene todos los pagos para la tabla
router.get('/', pagosAdmController.getAdmPagos);

module.exports = router;