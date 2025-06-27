const db = require('../../db');

const getPagos = async () => {
    try {
        console.log("Ejecutando consulta SQL para obtener pagos...");
        const [filas] = await db.execute(`
            SELECT 
                t.id_turno AS id,
                CONCAT(c.nombre, ' ', c.apellido) AS cliente,
                CONCAT(p.nombre, ' ', p.apellido) AS profesional,
                DATE_FORMAT(t.fecha_hora, '%Y-%m-%d') AS fecha_turno,
                carr.fecha_pago,
                -- Precio pagado según lógica de comisiones
                CASE 
                    WHEN carr.total > carr.subtotal THEN s.precio * 0.85  -- Tarjeta: precio - 15%
                    ELSE s.precio  -- Efectivo: precio completo
                END AS precio_pagado
            FROM turno t
            JOIN carritos carr ON t.id_carrito = carr.id
            JOIN cliente c ON t.id_cliente = c.id_cliente
            JOIN profesional p ON t.id_profesional = p.id_profesional
            JOIN servicio s ON t.id_servicio = s.id_servicio
            WHERE carr.estado = 'Completado'
            AND t.estado = 'Realizado'
            ORDER BY carr.fecha_pago DESC, t.fecha_hora DESC;
        `);
        console.log("Pagos obtenidos:", filas.length);
        return filas;
    } catch (error) {
        console.error('Error al obtener los pagos:', error);
        throw error;
    }
};

module.exports = {
    getPagos
};