const express = require('express');
const router = express.Router();
const serviciosAdmController = require('../../controllers/adm_controllers/serviciosAdmControllers');

// Coloca primero las rutas más específicas
router.get('/servicios/categoria/:id_categoria', serviciosAdmController.getServiciosPorCategoria);
router.get('/profesional/:id_profesional', serviciosAdmController.getServicioPorProfesional); // AGREGAR ESTA LÍNEA

// Ruta para crear un nuevo servicio
router.post('/', serviciosAdmController.crearServicio);

// Rutas generales
router.get('/', serviciosAdmController.getAdmServicios);
router.put('/:id', serviciosAdmController.actualizarServicio);
router.delete('/:id', serviciosAdmController.eliminarServicio);
router.get('/', serviciosAdmController.getServiciosPorTipo); 

module.exports = router;