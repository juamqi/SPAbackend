const express = require('express');
const cors = require('cors');

//usuarios
const clientesRoutes = require('./routes/user_routes/clientesRoutes.js');
const turnosRoutes = require('./routes/user_routes/turnosRoutes.js');
const serviciosRoutes = require('./routes/user_routes/serviciosRoutes.js');
const profesionalesRoutes = require('./routes/user_routes/profesionalesRoutes.js');
const carritoRoutes = require('./routes/user_routes/carritoRoutes.js');

//admin
const adminRoutes = require('./routes/adm_routes/adminAdmRoutes.js');
const turnosAdmRoutes = require('./routes/adm_routes/turnosAdmRoute.js');
const serviciosAdmRoutes = require('./routes/adm_routes/serviciosAdmRoutes.js');
const profesionalesAdmRoutes = require('./routes/adm_routes/profesionalesRoutes.js');
const categoriaAdmRoutes = require('./routes/adm_routes/categoriaAdmRoutes.js');
const clienteRoutes = require('./routes/adm_routes/clienteAdmRoutes.js');
const pagosAdmRoutes = require('./routes/adm_routes/pagosAdmRoutes.js'); // 👈 NUEVA LÍNEA

//email
const emailRoutes = require('./routes/email/emailRoutes.js');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

//usuarios
app.use('/api/clientes', clientesRoutes);
app.use('/api/turnos', turnosRoutes);
app.use('/api/servicios', serviciosRoutes);
app.use('/api/profesionales', profesionalesRoutes);
app.use('/api/carritos', carritoRoutes);

//admin
app.use('/api/admin', adminRoutes);
app.use('/api/turnosAdmin', turnosAdmRoutes);
app.use('/api/serviciosAdm', serviciosAdmRoutes);
app.use('/api/profesionalesAdm', profesionalesAdmRoutes);
app.use('/api/categoriasAdm', categoriaAdmRoutes);
app.use('/api/clientesAdm', clienteRoutes);
app.use('/api/pagosAdm', pagosAdmRoutes); 

//email
app.use('/api/email', emailRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});