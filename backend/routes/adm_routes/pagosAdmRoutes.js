const express = require('express');
const router = express.Router();
const pagosAdmController = require('../../controllers/adm_controllers/pagosAdmController');

// GET /api/admin/pagos - Obtiene todos los pagos para la tabla
router.get('/profesional/:idProfesional', pagosAdmController.getPagosPorProfesional);
router.get('/servicio/:idServicio', pagosAdmController.getPagosPorServicio);
router.get('/fechas', pagosAdmController.getPagosPorRangoFechas);
router.get('/', pagosAdmController.getAdmPagos); // Esta al final

module.exports = router;