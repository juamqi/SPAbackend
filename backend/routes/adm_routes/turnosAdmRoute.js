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

// NUEVAS RUTAS PARA MANEJO DE ESTADOS
router.get('/todos', turnosAdmController.getTodosLosTurnos);
router.get('/estado/:estado', turnosAdmController.getTurnosPorEstado);
router.get('/profesional/:idProfesional/turnos', turnosAdmController.getTurnosPorProfesionalYEstado);
router.put('/cambiar-estado/:idTurno', turnosAdmController.cambiarEstadoTurno);
router.get('/estadisticas/estados', turnosAdmController.getEstadisticasEstados);
router.get('/estados-disponibles', turnosAdmController.getEstadosDisponibles);

// Nueva ruta para actualizar un turno
router.put('/:id', turnosAdmController.actualizarTurno);
router.use((req, res, next) => {
    console.log(`Ruta turnosAdmin: ${req.method} ${req.originalUrl}`);
    next();
  });

module.exports = router;