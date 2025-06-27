// En turnosAdmRoute.js
const express = require('express');
const db = require('../../db');
const router = express.Router();
const turnosAdmController = require('../../controllers/adm_controllers/turnosAdmController');
router.get('/clientes/:idProfesional', turnosAdmController.getClientesPorProfesional);
router.get('/historial/:idCliente/:idProfesional', turnosAdmController.getHistorialClienteProfesional);
router.post('/', turnosAdmController.crearTurno);
// Rutas existentes
router.get('/', turnosAdmController.getAdmTurnos);
router.put('/estado/:id', turnosAdmController.actualizarEstadoTurno);
router.get('/por-fecha', turnosAdmController.getTurnosPorFecha);
router.get('/comentario/:idTurno', turnosAdmController.getComentarioTurno);
router.put('/comentario/:idTurno', turnosAdmController.actualizarComentarioTurno);
router.get('/comentarios/profesional/:idProfesional', turnosAdmController.getTurnosConComentariosPorProfesional);

// Nueva ruta para actualizar un turno
router.put('/:id', turnosAdmController.actualizarTurno);
router.use((req, res, next) => {
    console.log(`Ruta turnosAdmin: ${req.method} ${req.originalUrl}`);
    next();
  });

module.exports = router;