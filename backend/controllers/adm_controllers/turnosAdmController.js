const turnosAdmModel = require('../../models/admin_model/turnosAdmModels');

const getAdmTurnos = async (req, res) => {
    try {
        const turnos = await turnosAdmModel.getTurnos();
        res.status(200).json(turnos);
    } catch (error) {
        console.error('Error al obtener los turnos:', error);
        res.status(500).json({ error: 'Error al obtener los turnos' });
    }
};

// Añadir este método para actualizar el estado
const actualizarEstadoTurno = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        
        console.log(`Actualizando turno ${id} a estado ${estado}`);
        
        if (!estado || !['Solicitado', 'Confirmado', 'Cancelado', 'Realizado'].includes(estado)) {
            return res.status(400).json({ error: 'Estado no válido' });
        }
        
        const resultado = await turnosAdmModel.actualizarEstadoTurno(id, estado);
        console.log('Resultado de la actualización:', resultado);
        
        res.status(200).json({ 
            mensaje: 'Estado del turno actualizado correctamente',
            turnoId: id,
            nuevoEstado: estado 
        });
    } catch (error) {
        console.error('Error al actualizar el estado del turno:', error);
        res.status(500).json({ error: 'Error al actualizar el estado del turno' });
    }
};
const actualizarTurno = async (req, res) => {
    try {
        const { id } = req.params;
        const datosTurno = req.body;
        
        console.log(`Actualizando turno ID: ${id} con datos:`, datosTurno);
        
        // Validar los datos necesarios con estructura acorde al frontend
        if (!datosTurno.fecha || !datosTurno.hora || !datosTurno.id_profesional || 
            !datosTurno.id_cliente || !datosTurno.id_servicio) {
            return res.status(400).json({ error: 'Faltan datos requeridos para actualizar el turno' });
        }
        
        const resultado = await turnosAdmModel.actualizarTurnoConIds(id, datosTurno);
        
        res.status(200).json({ 
            mensaje: 'Turno actualizado correctamente',
            turnoId: id
        });
    } catch (error) {
        console.error('Error al actualizar el turno:', error);
        res.status(500).json({ error: 'Error al actualizar el turno' });
    }
};
const crearTurno = async (req, res) => {
    try {
        console.log("Datos recibidos del frontend:", req.body);
        
        // Verificar que existan los campos necesarios
        const { id_cliente, id_servicio, id_profesional, fecha, hora, estado, comentarios } = req.body;
        
        if (!id_cliente || !id_servicio || !id_profesional || !fecha || !hora) {
            return res.status(400).json({
                success: false,
                error: 'Faltan datos requeridos para crear el turno'
            });
        }
        
        // Transformar los datos al formato esperado por el modelo
        const nuevoTurno = {
            id_cliente,
            id_servicio,
            id_profesional,
            fecha,
            hora,
            estado: estado || 'Solicitado',
            comentarios: comentarios || '',
            duracion_minutos: req.body.duracion_minutos || 60
        };
        
        console.log("Datos transformados para el modelo:", nuevoTurno);
        
        // Llamar al modelo para guardar en la BD
        const resultado = await turnosAdmModel.crearNuevoTurno(nuevoTurno);
        
        res.status(201).json({
            success: true,
            mensaje: 'Turno creado correctamente',
            data: resultado
        });
    } catch (error) {
        console.error('Error en el controlador al crear turno:', error);
        res.status(500).json({
            success: false,
            error: 'Error al crear el turno: ' + error.message
        });
    }
};
const getTurnosPorFecha = async (req, res) => {
    const { fecha } = req.query;

    if (!fecha) {
        return res.status(400).json({ error: 'Se requiere el parámetro "fecha" en formato YYYY-MM-DD' });
    }

    try {
        const turnos = await turnoModel.getTurnosPorFecha(fecha);
        res.status(200).json(turnos);
    } catch (error) {
        console.error('Error en el controlador al obtener turnos por fecha:', error);
        res.status(500).json({ error: 'Error al obtener los turnos' });
    }
};
// Agregar estas funciones antes del module.exports

// Obtener clientes que tienen turnos con un profesional específico
const getClientesPorProfesional = async (req, res) => {
    try {
        const { idProfesional } = req.params;

        if (!idProfesional || isNaN(idProfesional)) {
            return res.status(400).json({ error: 'ID de profesional inválido' });
        }

        const clientes = await turnosAdmModel.getClientesPorProfesional(idProfesional);
        res.status(200).json(clientes);
    } catch (error) {
        console.error('Error al obtener clientes por profesional:', error);
        res.status(500).json({ error: 'Error al obtener los clientes del profesional' });
    }
};

// Obtener historial de turnos entre un cliente y un profesional
const getHistorialClienteProfesional = async (req, res) => {
    try {
        const { idCliente, idProfesional } = req.params;

        if (!idCliente || isNaN(idCliente) || !idProfesional || isNaN(idProfesional)) {
            return res.status(400).json({ error: 'IDs de cliente y profesional son requeridos y deben ser válidos' });
        }

        const historial = await turnosAdmModel.getHistorialClienteProfesional(idCliente, idProfesional);
        res.status(200).json(historial);
    } catch (error) {
        console.error('Error al obtener historial cliente-profesional:', error);
        res.status(500).json({ error: 'Error al obtener el historial' });
    }
};

const getComentarioTurno = async (req, res) => {
    try {
        const { idTurno } = req.params;

        if (!idTurno || isNaN(idTurno)) {
            return res.status(400).json({ error: 'ID de turno inválido' });
        }

        const comentario = await turnosAdmModel.getComentarioTurno(idTurno);
        res.status(200).json(comentario);
    } catch (error) {
        console.error('Error al obtener comentario del turno:', error);
        res.status(500).json({ error: 'Error al obtener el comentario del turno' });
    }
};

// Actualizar comentario de un turno específico
const actualizarComentarioTurno = async (req, res) => {
    try {
        const { idTurno } = req.params;
        const { comentarios } = req.body;

        if (!idTurno || isNaN(idTurno)) {
            return res.status(400).json({ error: 'ID de turno inválido' });
        }

        if (comentarios === undefined || comentarios === null) {
            return res.status(400).json({ error: 'El campo comentarios es requerido' });
        }

        const resultado = await turnosAdmModel.actualizarComentarioTurno(idTurno, comentarios);
        
        res.status(200).json({ 
            mensaje: 'Comentario actualizado correctamente',
            turnoId: idTurno
        });
    } catch (error) {
        console.error('Error al actualizar comentario del turno:', error);
        res.status(500).json({ error: 'Error al actualizar el comentario del turno' });
    }
};

// Obtener todos los turnos con comentarios de un profesional específico
const getTurnosConComentariosPorProfesional = async (req, res) => {
    try {
        const { idProfesional } = req.params;

        if (!idProfesional || isNaN(idProfesional)) {
            return res.status(400).json({ error: 'ID de profesional inválido' });
        }

        const turnos = await turnosAdmModel.getTurnosConComentariosPorProfesional(idProfesional);
        res.status(200).json(turnos);
    } catch (error) {
        console.error('Error al obtener turnos con comentarios del profesional:', error);
        res.status(500).json({ error: 'Error al obtener los turnos con comentarios' });
    }
};

// Obtener todos los turnos con todos los estados
const getTodosLosTurnos = async (req, res) => {
    try {
        const turnos = await turnosAdmModel.getTodosLosTurnos();
        res.status(200).json(turnos);
    } catch (error) {
        console.error('Error al obtener todos los turnos:', error);
        res.status(500).json({ error: 'Error al obtener todos los turnos' });
    }
};

// Obtener turnos por estado específico
const getTurnosPorEstado = async (req, res) => {
    try {
        const { estado } = req.params;
        
        const estadosValidos = ['Solicitado', 'Confirmado', 'Cancelado', 'Realizado'];
        if (!estadosValidos.includes(estado)) {
            return res.status(400).json({ 
                error: `Estado no válido. Estados válidos: ${estadosValidos.join(', ')}` 
            });
        }
        
        const turnos = await turnosAdmModel.getTurnosPorEstado(estado);
        res.status(200).json(turnos);
    } catch (error) {
        console.error('Error al obtener turnos por estado:', error);
        res.status(500).json({ error: 'Error al obtener turnos por estado' });
    }
};

// Obtener turnos por profesional con filtro opcional de estado
const getTurnosPorProfesionalYEstado = async (req, res) => {
    try {
        const { idProfesional } = req.params;
        const { estado } = req.query; // Estado opcional como query parameter
        
        if (!idProfesional || isNaN(idProfesional)) {
            return res.status(400).json({ error: 'ID de profesional inválido' });
        }
        
        // Validar estado si se proporciona
        if (estado) {
            const estadosValidos = ['Solicitado', 'Confirmado', 'Cancelado', 'Realizado'];
            if (!estadosValidos.includes(estado)) {
                return res.status(400).json({ 
                    error: `Estado no válido. Estados válidos: ${estadosValidos.join(', ')}` 
                });
            }
        }
        
        const turnos = await turnosAdmModel.getTurnosPorProfesionalYEstado(idProfesional, estado);
        res.status(200).json(turnos);
    } catch (error) {
        console.error('Error al obtener turnos por profesional y estado:', error);
        res.status(500).json({ error: 'Error al obtener turnos por profesional y estado' });
    }
};

// Cambiar estado de turno con comentario opcional
const cambiarEstadoTurno = async (req, res) => {
    try {
        const { idTurno } = req.params;
        const { nuevoEstado, comentario } = req.body;
        
        if (!idTurno || isNaN(idTurno)) {
            return res.status(400).json({ error: 'ID de turno inválido' });
        }
        
        if (!nuevoEstado) {
            return res.status(400).json({ error: 'El nuevo estado es requerido' });
        }
        
        const resultado = await turnosAdmModel.cambiarEstadoTurno(idTurno, nuevoEstado, comentario);
        
        res.status(200).json({
            mensaje: 'Estado del turno actualizado correctamente',
            turnoId: idTurno,
            estadoAnterior: resultado.estadoAnterior,
            nuevoEstado: resultado.nuevoEstado,
            comentariosActualizados: resultado.comentariosActualizados
        });
    } catch (error) {
        console.error('Error al cambiar estado del turno:', error);
        res.status(500).json({ error: error.message || 'Error al cambiar estado del turno' });
    }
};

// Obtener estadísticas de estados
const getEstadisticasEstados = async (req, res) => {
    try {
        const { idProfesional } = req.query; // Opcional como query parameter
        
        // Validar ID de profesional si se proporciona
        if (idProfesional && isNaN(idProfesional)) {
            return res.status(400).json({ error: 'ID de profesional inválido' });
        }
        
        const estadisticas = await turnosAdmModel.getEstadisticasEstados(idProfesional || null);
        res.status(200).json(estadisticas);
    } catch (error) {
        console.error('Error al obtener estadísticas de estados:', error);
        res.status(500).json({ error: 'Error al obtener estadísticas de estados' });
    }
};

// Obtener estados disponibles (útil para selects en el frontend)
const getEstadosDisponibles = async (req, res) => {
    try {
        const estados = [
            { valor: 'Solicitado', etiqueta: 'Solicitado', descripcion: 'Turno solicitado por el cliente' },
            { valor: 'Confirmado', etiqueta: 'Confirmado', descripcion: 'Turno confirmado por el profesional' },
            { valor: 'Cancelado', etiqueta: 'Cancelado', descripcion: 'Turno cancelado' },
            { valor: 'Realizado', etiqueta: 'Realizado', descripcion: 'Turno completado exitosamente' }
        ];
        
        res.status(200).json(estados);
    } catch (error) {
        console.error('Error al obtener estados disponibles:', error);
        res.status(500).json({ error: 'Error al obtener estados disponibles' });
    }
};

/////comentario
module.exports = {
    getTurnosPorFecha,
    crearTurno,
    getAdmTurnos,
    actualizarEstadoTurno,
    actualizarTurno,
        getClientesPorProfesional,        // NUEVA
    getHistorialClienteProfesional,
    getComentarioTurno,
    actualizarComentarioTurno,
    getTurnosConComentariosPorProfesional,
    getTodosLosTurnos,
    getTurnosPorEstado,
    getTurnosPorProfesionalYEstado,
    cambiarEstadoTurno,
    getEstadisticasEstados,
    getEstadosDisponibles 
};