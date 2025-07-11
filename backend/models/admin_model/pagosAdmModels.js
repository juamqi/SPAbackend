// En pagosAdmModels.js
const db = require('../../db');

const getPagos = async () => {
    try {
        console.log("Ejecutando consulta SQL para obtener pagos...");
        const [filas] = await db.execute(`
            SELECT 
                t.id_turno AS id,
                CONCAT(c.nombre, ' ', c.apellido) AS cliente,
                CONCAT(p.nombre, ' ', p.apellido) AS profesional,
                s.nombre AS servicio,
                DATE_FORMAT(t.fecha_hora, '%Y-%m-%d') AS fecha_turno,
                carr.fecha_pago,
                -- Precio pagado según lógica de descuento por reserva anticipada
                CASE 
                    WHEN DATEDIFF(t.fecha_hora, carr.fecha_pago) > 2 THEN s.precio * 0.85  -- Reserva 2+ días antes: precio - 15%
                    ELSE s.precio  -- Reserva último momento: precio completo
                END AS precio_pagado
            FROM turno t
            JOIN carritos carr ON t.id_carrito = carr.id
            JOIN cliente c ON t.id_cliente = c.id_cliente
            JOIN profesional p ON t.id_profesional = p.id_profesional
            JOIN servicio s ON t.id_servicio = s.id_servicio
            WHERE carr.estado = 'Pagado'
            ORDER BY carr.fecha_pago DESC, t.fecha_hora DESC;
        `);
        console.log("Pagos obtenidos:", filas.length);
        return filas;
    } catch (error) {
        console.error('Error al obtener los pagos:', error);
        throw error;
    }
};

const getPagosPorProfesional = async (idProfesional) => {
    try {
        console.log(`Ejecutando consulta SQL para obtener pagos del profesional ID: ${idProfesional}`);
        const [filas] = await db.execute(`
            SELECT 
                t.id_turno AS id,
                CONCAT(c.nombre, ' ', c.apellido) AS cliente,
                CONCAT(p.nombre, ' ', p.apellido) AS profesional,
                s.nombre AS servicio,
                DATE_FORMAT(t.fecha_hora, '%Y-%m-%d') AS fecha_turno,
                carr.fecha_pago,
                CASE 
                    WHEN DATEDIFF(t.fecha_hora, carr.fecha_pago) > 2 THEN s.precio * 0.85
                    ELSE s.precio
                END AS precio_pagado
            FROM turno t
            JOIN carritos carr ON t.id_carrito = carr.id
            JOIN cliente c ON t.id_cliente = c.id_cliente
            JOIN profesional p ON t.id_profesional = p.id_profesional
            JOIN servicio s ON t.id_servicio = s.id_servicio
            WHERE carr.estado = 'Pagado'
            AND p.id_profesional = ?
            ORDER BY carr.fecha_pago DESC, t.fecha_hora DESC;
        `, [idProfesional]);
        console.log(`Pagos obtenidos para profesional ${idProfesional}:`, filas.length);
        return filas;
    } catch (error) {
        console.error(`Error al obtener los pagos del profesional ${idProfesional}:`, error);
        throw error;
    }
};

const getPagosPorServicio = async (idServicio) => {
    try {
        console.log(`Ejecutando consulta SQL para obtener pagos del servicio ID: ${idServicio}`);
        const [filas] = await db.execute(`
            SELECT 
                t.id_turno AS id,
                CONCAT(c.nombre, ' ', c.apellido) AS cliente,
                CONCAT(p.nombre, ' ', p.apellido) AS profesional,
                DATE_FORMAT(t.fecha_hora, '%Y-%m-%d') AS fecha_turno,
                carr.fecha_pago,
                s.nombre AS servicio,
                CASE 
                    WHEN DATEDIFF(t.fecha_hora, carr.fecha_pago) > 2 THEN s.precio * 0.85
                    ELSE s.precio
                END AS precio_pagado
            FROM turno t
            JOIN carritos carr ON t.id_carrito = carr.id
            JOIN cliente c ON t.id_cliente = c.id_cliente
            JOIN profesional p ON t.id_profesional = p.id_profesional
            JOIN servicio s ON t.id_servicio = s.id_servicio
            WHERE carr.estado = 'Pagado'
            AND s.id_servicio = ?
            ORDER BY carr.fecha_pago DESC, t.fecha_hora DESC;
        `, [idServicio]);
        console.log(`Pagos obtenidos para servicio ${idServicio}:`, filas.length);
        return filas;
    } catch (error) {
        console.error(`Error al obtener los pagos del servicio ${idServicio}:`, error);
        throw error;
    }
};

const getPagosPorRangoFechas = async (fechaInicio, fechaFin) => {
    try {
        console.log(`Ejecutando consulta SQL para obtener pagos entre ${fechaInicio} y ${fechaFin}`);
        
        // Debug: Verificar los valores exactos que llegan
        console.log('Tipo de fechaInicio:', typeof fechaInicio, 'Valor:', fechaInicio);
        console.log('Tipo de fechaFin:', typeof fechaFin, 'Valor:', fechaFin);
        
        const [filas] = await db.execute(`
            SELECT 
                t.id_turno AS id,
                CONCAT(c.nombre, ' ', c.apellido) AS cliente,
                CONCAT(p.nombre, ' ', p.apellido) AS profesional,
                s.nombre AS servicio,
                DATE_FORMAT(t.fecha_hora, '%Y-%m-%d') AS fecha_turno,
                carr.fecha_pago,
                DATE_FORMAT(carr.fecha_pago, '%Y-%m-%d') AS fecha_pago_formatted,
                CASE 
                    WHEN DATEDIFF(t.fecha_hora, carr.fecha_pago) > 2 THEN s.precio * 0.85
                    ELSE s.precio
                END AS precio_pagado,
                -- Debug: Mostrar las comparaciones
                (carr.fecha_pago >= ?) AS cumple_inicio,
                (carr.fecha_pago <= ?) AS cumple_fin
            FROM turno t
            JOIN carritos carr ON t.id_carrito = carr.id
            JOIN cliente c ON t.id_cliente = c.id_cliente
            JOIN profesional p ON t.id_profesional = p.id_profesional
            JOIN servicio s ON t.id_servicio = s.id_servicio
            WHERE carr.estado = 'Pagado'
            AND carr.fecha_pago >= ?
            AND carr.fecha_pago <= ?
            ORDER BY carr.fecha_pago DESC, t.fecha_hora DESC;
        `, [fechaInicio, fechaFin, fechaInicio, fechaFin]);
        
        console.log(`Pagos obtenidos entre ${fechaInicio} y ${fechaFin}:`, filas.length);
        
        // Debug: Mostrar los primeros registros con las fechas
        if (filas.length > 0) {
            console.log('Primeros 3 registros con fechas:');
            filas.slice(0, 3).forEach((fila, index) => {
                console.log(`${index + 1}. ID: ${fila.id}, fecha_pago: ${fila.fecha_pago}, formatted: ${fila.fecha_pago_formatted}, cumple_inicio: ${fila.cumple_inicio}, cumple_fin: ${fila.cumple_fin}`);
            });
        }
        
        return filas;
    } catch (error) {
        console.error(`Error al obtener los pagos entre ${fechaInicio} y ${fechaFin}:`, error);
        throw error;
    }
};
module.exports = {
    getPagos,
    getPagosPorProfesional,
    getPagosPorServicio,
    getPagosPorRangoFechas
};