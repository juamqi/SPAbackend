// En turnosAdmModels.js
const db = require('../../db');

const getTurnos = async () => {
    try {
        console.log("Ejecutando consulta SQL para obtener turnos...");
        const [filas] = await db.execute(`
            SELECT 
                turno.id_turno AS id,
                DATE_FORMAT(turno.fecha_hora, '%Y-%m-%d') AS fecha,
                TIME_FORMAT(turno.fecha_hora, '%H:%i') AS hora,
                profesional.nombre AS profesional,
                cliente.nombre AS cliente,
                servicio.nombre AS servicio,
                servicio.precio AS precio,
                turno.estado AS estado
            FROM turno
            JOIN profesional ON turno.id_profesional = profesional.id_profesional
            JOIN cliente ON turno.id_cliente = cliente.id_cliente
            JOIN servicio ON turno.id_servicio = servicio.id_servicio
            WHERE turno.estado IN ('Solicitado', 'Cancelado')
            AND turno.fecha_hora >= NOW()
            ORDER BY turno.fecha_hora ASC;
        `);
        console.log("Turnos obtenidos:", filas.length);
        return filas;
    } catch (error) {
        console.error('Error al obtener los turnos:', error);
        throw error;
    }
};
const getTurnosPorFecha = async (fecha) => {
    try {
        console.log(`Buscando turnos para la fecha: ${fecha}`);
        const [filas] = await db.execute(`
            SELECT 
                turno.id_turno AS id,
                DATE_FORMAT(turno.fecha_hora, '%Y-%m-%d') AS fecha,
                TIME_FORMAT(turno.fecha_hora, '%H:%i') AS hora,
                profesional.nombre AS profesional,
                cliente.nombre AS cliente,
                servicio.nombre AS servicio,
                servicio.precio AS precio,
                turno.estado AS estado
            FROM turno
            JOIN profesional ON turno.id_profesional = profesional.id_profesional
            JOIN cliente ON turno.id_cliente = cliente.id_cliente
            JOIN servicio ON turno.id_servicio = servicio.id_servicio
            WHERE turno.estado IN ('Solicitado', 'Cancelado')
            AND DATE(turno.fecha_hora) = ?
            ORDER BY turno.fecha_hora ASC;
        `, [fecha]);
        console.log(`Turnos encontrados para ${fecha}:`, filas.length);
        return filas;
    } catch (error) {
        console.error(`Error al obtener los turnos para la fecha ${fecha}:`, error);
        throw error;
    }
};

// Añadir esta función para actualizar el estado
const actualizarEstadoTurno = async (idTurno, estado) => {
    try {
        console.log(`Actualizando turno ${idTurno} a estado ${estado} en la BD`);
        
        const [resultado] = await db.execute(
            'UPDATE turno SET estado = ? WHERE id_turno = ?',
            [estado, idTurno]
        );
        
        console.log('Resultado de la actualización en BD:', resultado);
        
        if (resultado.affectedRows === 0) {
            throw new Error(`No se encontró el turno con id ${idTurno}`);
        }
        
        return resultado;
    } catch (error) {
        console.error('Error al actualizar el estado del turno en BD:', error);
        throw error;
    }
};
/**
 * Crea un nuevo turno en la base de datos
 * @param {Object} nuevoTurno - Datos del turno a crear
 * @returns {Promise} Resultado de la operación
 */
const crearNuevoTurno = async (nuevoTurno) => {
    try {
        console.log("Creando un nuevo turno en la BD:", nuevoTurno);
        
        const fechaHora = `${nuevoTurno.fecha} ${nuevoTurno.hora}:00`;
        
        const [resultado] = await db.execute(
            `INSERT INTO turno (id_cliente, id_servicio, id_profesional, fecha_hora, duracion_minutos, estado, comentarios)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                nuevoTurno.id_cliente,
                nuevoTurno.id_servicio,
                nuevoTurno.id_profesional,
                fechaHora,
                nuevoTurno.duracion_minutos || 60, // Valor por defecto si no se pasa
                nuevoTurno.estado || 'Solicitado',
                nuevoTurno.comentarios || null
            ]
        );
        
        console.log('Nuevo turno creado con ID:', resultado.insertId);
        return resultado;
    } catch (error) {
        console.error('Error al crear un nuevo turno en la BD:', error);
        throw error;
    }
};

const actualizarTurno = async (idTurno, datosTurno) => {
    try {
        console.log(`Actualizando turno ID: ${idTurno} en la BD`);
        
        // Obtener los IDs necesarios basados en los nombres
        const [profesionalResult] = await db.execute(
            'SELECT id_profesional FROM profesional WHERE nombre = ?',
            [datosTurno.profesional]
        );
        
        const [clienteResult] = await db.execute(
            'SELECT id_cliente FROM cliente WHERE nombre = ?',
            [datosTurno.cliente]
        );
        
        const [servicioResult] = await db.execute(
            'SELECT id_servicio FROM servicio WHERE nombre = ?',
            [datosTurno.servicio]
        );
        
        if (profesionalResult.length === 0 || clienteResult.length === 0 || servicioResult.length === 0) {
            throw new Error('No se encontró el profesional, cliente o servicio especificado');
        }
        
        const idProfesional = profesionalResult[0].id_profesional;
        const idCliente = clienteResult[0].id_cliente;
        const idServicio = servicioResult[0].id_servicio;
        
        // Crear la fecha-hora combinada
        const fechaHora = `${datosTurno.fecha} ${datosTurno.hora}:00`;
        
        // Actualizar el turno
        const [resultado] = await db.execute(
            `UPDATE turno 
             SET id_profesional = ?, 
                 id_cliente = ?, 
                 id_servicio = ?, 
                 fecha_hora = ?
             WHERE id_turno = ?`,
            [idProfesional, idCliente, idServicio, fechaHora, idTurno]
        );
        
        if (resultado.affectedRows === 0) {
            throw new Error(`No se encontró el turno con id ${idTurno}`);
        }
        
        return resultado;
    } catch (error) {
        console.error('Error al actualizar el turno en la BD:', error);
        throw error;
    }
};

// Nueva función que acepta directamente los IDs enviados por el frontend
const actualizarTurnoConIds = async (idTurno, datosTurno) => {
    try {
        console.log(`Actualizando turno ID: ${idTurno} en la BD con IDs directos`);
        
        // Validar que tenemos los IDs necesarios
        const idProfesional = datosTurno.id_profesional;
        const idCliente = datosTurno.id_cliente;
        const idServicio = datosTurno.id_servicio;
        
        // Crear la fecha-hora combinada
        const fechaHora = `${datosTurno.fecha} ${datosTurno.hora}:00`;
        
        // Actualizar el turno
        const [resultado] = await db.execute(
            `UPDATE turno 
             SET id_profesional = ?, 
                 id_cliente = ?, 
                 id_servicio = ?, 
                 fecha_hora = ?,
                 comentarios = ?
             WHERE id_turno = ?`,
            [idProfesional, idCliente, idServicio, fechaHora, datosTurno.comentarios || '', idTurno]
        );
        
        if (resultado.affectedRows === 0) {
            throw new Error(`No se encontró el turno con id ${idTurno}`);
        }
        
        return resultado;
    } catch (error) {
        console.error('Error al actualizar el turno con IDs en la BD:', error);
        throw error;
    }
};
// Agregar estas funciones al final del archivo, antes del module.exports

// Obtener clientes únicos que tienen turnos con un profesional específico
const getClientesPorProfesional = async (idProfesional) => {
    try {
        console.log(`Obteniendo clientes para profesional ID: ${idProfesional}`);
        const [filas] = await db.execute(`
            SELECT DISTINCT
                cliente.id_cliente AS id,
                cliente.nombre,
                cliente.apellido,
                cliente.email,
                cliente.telefono,
                cliente.direccion,
                cliente.fecha_registro
            FROM turno
            JOIN cliente ON turno.id_cliente = cliente.id_cliente
            WHERE turno.id_profesional = ?
            AND turno.estado IN ('Solicitado', 'Cancelado', 'Realizado')
            ORDER BY cliente.nombre ASC, cliente.apellido ASC;
        `, [idProfesional]);
        
        console.log(`Clientes encontrados para profesional ${idProfesional}:`, filas.length);
        return filas;
    } catch (error) {
        console.error('Error al obtener clientes por profesional:', error);
        throw error;
    }
};

// Obtener historial de turnos entre un cliente específico y un profesional específico
const getHistorialClienteProfesional = async (idCliente, idProfesional) => {
    try {
        console.log(`Obteniendo historial - Cliente: ${idCliente}, Profesional: ${idProfesional}`);
        const [filas] = await db.execute(`
            SELECT 
                turno.id_turno AS id,
                DATE_FORMAT(turno.fecha_hora, '%Y-%m-%d') AS fecha,
                TIME_FORMAT(turno.fecha_hora, '%H:%i') AS hora,
                servicio.nombre AS servicio,
                servicio.precio AS precio,
                turno.estado AS estado,
                turno.comentarios
            FROM turno
            JOIN servicio ON turno.id_servicio = servicio.id_servicio
            WHERE turno.id_cliente = ?
            AND turno.id_profesional = ?
            ORDER BY turno.fecha_hora DESC;
        `, [idCliente, idProfesional]);
        
        console.log(`Turnos encontrados para cliente ${idCliente} con profesional ${idProfesional}:`, filas.length);
        return filas;
    } catch (error) {
        console.error('Error al obtener historial cliente-profesional:', error);
        throw error;
    }
};

// Obtener comentario de un turno específico
const getComentarioTurno = async (idTurno) => {
    try {
        console.log(`Obteniendo comentario para turno ID: ${idTurno}`);
        const [filas] = await db.execute(`
            SELECT 
                turno.id_turno AS id,
                turno.comentarios,
                DATE_FORMAT(turno.fecha_hora, '%Y-%m-%d') AS fecha,
                TIME_FORMAT(turno.fecha_hora, '%H:%i') AS hora,
                cliente.nombre AS cliente_nombre,
                cliente.apellido AS cliente_apellido,
                servicio.nombre AS servicio_nombre,
                turno.estado
            FROM turno
            JOIN cliente ON turno.id_cliente = cliente.id_cliente
            JOIN servicio ON turno.id_servicio = servicio.id_servicio
            WHERE turno.id_turno = ?
        `, [idTurno]);
        
        if (filas.length === 0) {
            throw new Error(`No se encontró el turno con ID ${idTurno}`);
        }
        
        console.log(`Comentario obtenido para turno ${idTurno}`);
        return filas[0];
    } catch (error) {
        console.error('Error al obtener comentario del turno:', error);
        throw error;
    }
};

// Actualizar comentario de un turno específico
const actualizarComentarioTurno = async (idTurno, comentarios) => {
    try {
        console.log(`Actualizando comentario para turno ${idTurno}`);
        
        const [resultado] = await db.execute(
            'UPDATE turno SET comentarios = ? WHERE id_turno = ?',
            [comentarios, idTurno]
        );
        
        console.log('Resultado de la actualización de comentario:', resultado);
        
        if (resultado.affectedRows === 0) {
            throw new Error(`No se encontró el turno con id ${idTurno}`);
        }
        
        return resultado;
    } catch (error) {
        console.error('Error al actualizar comentario del turno en BD:', error);
        throw error;
    }
};

// Obtener todos los turnos con comentarios de un profesional específico
const getTurnosConComentariosPorProfesional = async (idProfesional) => {
    try {
        console.log(`Obteniendo turnos con comentarios para profesional ID: ${idProfesional}`);
        const [filas] = await db.execute(`
            SELECT 
                turno.id_turno AS id,
                DATE_FORMAT(turno.fecha_hora, '%Y-%m-%d') AS fecha,
                TIME_FORMAT(turno.fecha_hora, '%H:%i') AS hora,
                cliente.nombre AS cliente_nombre,
                cliente.apellido AS cliente_apellido,
                cliente.id_cliente,
                servicio.nombre AS servicio_nombre,
                servicio.precio AS precio,
                turno.estado,
                turno.comentarios,
                CASE 
                    WHEN turno.comentarios IS NOT NULL AND turno.comentarios != '' 
                    THEN 1 
                    ELSE 0 
                END AS tiene_comentarios
            FROM turno
            JOIN cliente ON turno.id_cliente = cliente.id_cliente
            JOIN servicio ON turno.id_servicio = servicio.id_servicio
            WHERE turno.id_profesional = ?
            ORDER BY turno.fecha_hora DESC
        `, [idProfesional]);
        
        console.log(`Turnos con comentarios encontrados para profesional ${idProfesional}:`, filas.length);
        return filas;
    } catch (error) {
        console.error('Error al obtener turnos con comentarios del profesional:', error);
        throw error;
    }
};

// Obtener todos los turnos con todos los estados (para historial completo)
const getTodosLosTurnos = async () => {
    try {
        console.log("Obteniendo todos los turnos con todos los estados...");
        const [filas] = await db.execute(`
            SELECT 
                turno.id_turno AS id,
                DATE_FORMAT(turno.fecha_hora, '%Y-%m-%d') AS fecha,
                TIME_FORMAT(turno.fecha_hora, '%H:%i') AS hora,
                profesional.nombre AS profesional,
                cliente.nombre AS cliente,
                servicio.nombre AS servicio,
                servicio.precio AS precio,
                turno.estado AS estado,
                turno.comentarios,
                DATE_FORMAT(turno.fecha_solicitud, '%Y-%m-%d %H:%i') AS fecha_solicitud
            FROM turno
            JOIN profesional ON turno.id_profesional = profesional.id_profesional
            JOIN cliente ON turno.id_cliente = cliente.id_cliente
            JOIN servicio ON turno.id_servicio = servicio.id_servicio
            ORDER BY turno.fecha_hora DESC;
        `);
        console.log("Total de turnos obtenidos:", filas.length);
        return filas;
    } catch (error) {
        console.error('Error al obtener todos los turnos:', error);
        throw error;
    }
};

// Obtener turnos por estado específico
const getTurnosPorEstado = async (estado) => {
    try {
        console.log(`Obteniendo turnos con estado: ${estado}`);
        const [filas] = await db.execute(`
            SELECT 
                turno.id_turno AS id,
                DATE_FORMAT(turno.fecha_hora, '%Y-%m-%d') AS fecha,
                TIME_FORMAT(turno.fecha_hora, '%H:%i') AS hora,
                profesional.nombre AS profesional,
                cliente.nombre AS cliente,
                servicio.nombre AS servicio,
                servicio.precio AS precio,
                turno.estado AS estado,
                turno.comentarios,
                DATE_FORMAT(turno.fecha_solicitud, '%Y-%m-%d %H:%i') AS fecha_solicitud
            FROM turno
            JOIN profesional ON turno.id_profesional = profesional.id_profesional
            JOIN cliente ON turno.id_cliente = cliente.id_cliente
            JOIN servicio ON turno.id_servicio = servicio.id_servicio
            WHERE turno.estado = ?
            ORDER BY turno.fecha_hora DESC;
        `, [estado]);
        console.log(`Turnos encontrados con estado ${estado}:`, filas.length);
        return filas;
    } catch (error) {
        console.error(`Error al obtener turnos con estado ${estado}:`, error);
        throw error;
    }
};

// Obtener turnos por profesional con filtro de estado
const getTurnosPorProfesionalYEstado = async (idProfesional, estado = null) => {
    try {
        let query = `
            SELECT 
                turno.id_turno AS id,
                DATE_FORMAT(turno.fecha_hora, '%Y-%m-%d') AS fecha,
                TIME_FORMAT(turno.fecha_hora, '%H:%i') AS hora,
                cliente.nombre AS cliente,
                cliente.apellido AS cliente_apellido,
                servicio.nombre AS servicio,
                servicio.precio AS precio,
                turno.estado AS estado,
                turno.comentarios,
                DATE_FORMAT(turno.fecha_solicitud, '%Y-%m-%d %H:%i') AS fecha_solicitud
            FROM turno
            JOIN cliente ON turno.id_cliente = cliente.id_cliente
            JOIN servicio ON turno.id_servicio = servicio.id_servicio
            WHERE turno.id_profesional = ?
        `;
        
        let parametros = [idProfesional];
        
        if (estado) {
            query += ` AND turno.estado = ?`;
            parametros.push(estado);
        }
        
        query += ` ORDER BY turno.fecha_hora DESC`;
        
        console.log(`Obteniendo turnos para profesional ${idProfesional}${estado ? ` con estado ${estado}` : ''}`);
        const [filas] = await db.execute(query, parametros);
        
        console.log(`Turnos encontrados:`, filas.length);
        return filas;
    } catch (error) {
        console.error('Error al obtener turnos por profesional y estado:', error);
        throw error;
    }
};

// Cambiar estado de turno con validación
const cambiarEstadoTurno = async (idTurno, nuevoEstado, comentarioActualizacion = null) => {
    try {
        console.log(`Cambiando estado del turno ${idTurno} a ${nuevoEstado}`);
        
        // Validar que el estado sea válido
        const estadosValidos = ['Solicitado', 'Confirmado', 'Cancelado', 'Realizado'];
        if (!estadosValidos.includes(nuevoEstado)) {
            throw new Error(`Estado no válido: ${nuevoEstado}. Estados válidos: ${estadosValidos.join(', ')}`);
        }
        
        // Obtener el estado actual
        const [turnoActual] = await db.execute(
            'SELECT estado, comentarios FROM turno WHERE id_turno = ?',
            [idTurno]
        );
        
        if (turnoActual.length === 0) {
            throw new Error(`No se encontró el turno con ID ${idTurno}`);
        }
        
        const estadoAnterior = turnoActual[0].estado;
        const comentariosActuales = turnoActual[0].comentarios || '';
        
        // Construir nuevos comentarios si se proporciona una actualización
        let nuevosComentarios = comentariosActuales;
        if (comentarioActualizacion) {
            const timestamp = new Date().toLocaleString('es-AR');
            const comentarioEstado = `[${timestamp}] Estado cambiado de "${estadoAnterior}" a "${nuevoEstado}": ${comentarioActualizacion}`;
            nuevosComentarios = comentariosActuales ? `${comentariosActuales}\n\n${comentarioEstado}` : comentarioEstado;
        }
        
        // Actualizar el estado y comentarios
        const [resultado] = await db.execute(
            'UPDATE turno SET estado = ?, comentarios = ? WHERE id_turno = ?',
            [nuevoEstado, nuevosComentarios, idTurno]
        );
        
        console.log(`Estado actualizado exitosamente de "${estadoAnterior}" a "${nuevoEstado}"`);
        
        if (resultado.affectedRows === 0) {
            throw new Error(`No se pudo actualizar el turno con ID ${idTurno}`);
        }
        
        return {
            ...resultado,
            estadoAnterior,
            nuevoEstado,
            comentariosActualizados: nuevosComentarios
        };
    } catch (error) {
        console.error('Error al cambiar estado del turno:', error);
        throw error;
    }
};

// Obtener estadísticas de estados de turnos
const getEstadisticasEstados = async (idProfesional = null) => {
    try {
        let query = `
            SELECT 
                estado,
                COUNT(*) as cantidad,
                ROUND((COUNT(*) * 100.0 / SUM(COUNT(*)) OVER()), 2) as porcentaje
            FROM turno
        `;
        
        let parametros = [];
        
        if (idProfesional) {
            query += ` WHERE id_profesional = ?`;
            parametros.push(idProfesional);
        }
        
        query += ` GROUP BY estado ORDER BY cantidad DESC`;
        
        console.log(`Obteniendo estadísticas de estados${idProfesional ? ` para profesional ${idProfesional}` : ''}`);
        const [filas] = await db.execute(query, parametros);
        
        console.log('Estadísticas obtenidas:', filas);
        return filas;
    } catch (error) {
        console.error('Error al obtener estadísticas de estados:', error);
        throw error;
    }
};

// Exportar la nueva función
module.exports = {
    getTurnosPorFecha,
    actualizarTurnoConIds,
    crearNuevoTurno,
    getTurnos,
    actualizarEstadoTurno,
    actualizarTurno,
    getClientesPorProfesional,        // NUEVA
    getHistorialClienteProfesional,    // NUEVA
    getComentarioTurno,
    actualizarComentarioTurno,
    getTurnosConComentariosPorProfesional,
    getTodosLosTurnos,
    getTurnosPorEstado,
    getTurnosPorProfesionalYEstado,
    cambiarEstadoTurno,
    getEstadisticasEstados
};