const pagosAdmModel = require('../../models/admin_model/pagosAdmModels');

const getAdmPagos = async (req, res) => {
    try {
        const pagos = await pagosAdmModel.getPagos();
        res.status(200).json(pagos);
    } catch (error) {
        console.error('Error al obtener los pagos:', error);
        res.status(500).json({ error: 'Error al obtener los pagos' });
    }
};

const getPagosPorProfesional = async (req, res) => {
    const { idProfesional } = req.params;

    if (!idProfesional || isNaN(idProfesional)) {
        return res.status(400).json({ error: 'ID de profesional inválido' });
    }

    try {
        const pagos = await pagosAdmModel.getPagosPorProfesional(idProfesional);
        res.status(200).json(pagos);
    } catch (error) {
        console.error('Error al obtener los pagos por profesional:', error);
        res.status(500).json({ error: 'Error al obtener los pagos del profesional' });
    }
};

const getPagosPorServicio = async (req, res) => {
    const { idServicio } = req.params;

    if (!idServicio || isNaN(idServicio)) {
        return res.status(400).json({ error: 'ID de servicio inválido' });
    }

    try {
        const pagos = await pagosAdmModel.getPagosPorServicio(idServicio);
        res.status(200).json(pagos);
    } catch (error) {
        console.error('Error al obtener los pagos por servicio:', error);
        res.status(500).json({ error: 'Error al obtener los pagos del servicio' });
    }
};

const getPagosPorRangoFechas = async (req, res) => {
    const { fechaInicio, fechaFin } = req.query;

    if (!fechaInicio || !fechaFin) {
        return res.status(400).json({ 
            error: 'Se requieren fechaInicio y fechaFin en formato YYYY-MM-DD' 
        });
    }

    // Validar formato de fechas
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fechaInicio) || !fechaRegex.test(fechaFin)) {
        return res.status(400).json({ 
            error: 'Formato de fecha inválido. Use YYYY-MM-DD' 
        });
    }

    // Validar que fechaInicio no sea mayor que fechaFin
    if (fechaInicio > fechaFin) {
        return res.status(400).json({ 
            error: 'La fecha de inicio no puede ser mayor que la fecha de fin' 
        });
    }

    try {
        const pagos = await pagosAdmModel.getPagosPorRangoFechas(fechaInicio, fechaFin);
        res.status(200).json(pagos);
    } catch (error) {
        console.error('Error al obtener los pagos por rango de fechas:', error);
        res.status(500).json({ error: 'Error al obtener los pagos por fechas' });
    }
};

module.exports = {
    getAdmPagos,
    getPagosPorProfesional,
    getPagosPorServicio,
    getPagosPorRangoFechas
};