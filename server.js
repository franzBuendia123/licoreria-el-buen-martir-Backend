// server.js - Solución CORS Final

// 1. IMPORTACIONES NECESARIAS
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Esencial para la comunicación entre dominios

// 2. CONFIGURACIÓN INICIAL
const app = express();
const PORT = process.env.PORT || 10000;
const MONGO_URI = process.env.MONGO_URI; 

// 🛑 CONFIGURACIÓN CLAVE DE CORS 🛑
// Permite que solo tu Frontend (GitHub Pages) acceda a esta API.
const corsOptions = {
    // URL exacta de tu Frontend (GitHub Pages)
    origin: 'https://franzbuendia123.github.io', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};

// 3. MIDDLEWARE
app.use(cors(corsOptions)); // Aplicar la configuración de CORS
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// 4. DEFINICIÓN DEL MODELO (Asegúrate que coincida con tus datos insertados)
const productSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    precio_regular: { type: Number, required: true },
    precio_oferta: { type: Number }, 
    descuento_porcentaje: { type: Number },
    imagen_url: { type: String },
    categoria: { type: String, required: true },
    es_oferta: { type: Boolean, default: false }
});

// Usamos 'products' como el nombre de la colección
const Product = mongoose.model('Product', productSchema, 'products'); 


// 5. RUTAS DE LA API
app.get('/api/productos', async (req, res) => {
    try {
        const productos = await Product.find({});
        res.status(200).json(productos); 
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener productos.' });
    }
});

app.get('/', (req, res) => {
    res.send('Servidor de Licoreria El Buen Mártir funcionando.');
});


// 6. CONEXIÓN A MONGODB ATLAS Y ARRANQUE DEL SERVIDOR
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Conexión exitosa a MongoDB Atlas');
        app.listen(PORT, () => {
            console.log(`🚀 Servidor backend escuchando en el puerto ${PORT}`);
        });

    })
    .catch((error) => {
        console.error('Error de conexión a MongoDB:', error);
    });
// 7. EXPORTAR LA APP (opcional, pero útil)
module.exports = app;

