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

module.exports = {
    getAdmPagos
};