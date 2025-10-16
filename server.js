// server.js COMPLETO Y CORREGIDO

// 1. IMPORTACIONES NECESARIAS
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Librería esencial para permitir conexión desde el Frontend

// 2. CONFIGURACIÓN
const app = express();
const PORT = process.env.PORT || 10000;
const MONGO_URI = process.env.MONGO_URI; 

// 🛑 CONFIGURACIÓN CLAVE DE CORS 🛑
const corsOptions = {
    // URL exacta de tu Frontend alojado en GitHub Pages
    origin: 'https://franzbuendia123.github.io', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};

// 3. MIDDLEWARE
app.use(cors(corsOptions)); // Aplicar la configuración de CORS
app.use(express.json()); // Para procesar JSON en las peticiones
app.use(express.urlencoded({ extended: true })); // Para procesar datos de formularios

// 4. CONEXIÓN A MONGODB ATLAS
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Conexión exitosa a MongoDB Atlas');
        
        // El servidor solo debe empezar a escuchar después de que la DB esté conectada
        app.listen(PORT, () => {
            console.log(`🚀 Servidor backend escuchando en el puerto ${PORT}`);
        });

    })
    .catch((error) => {
        console.error('Error de conexión a MongoDB:', error);
        // Si hay error en DB, el servidor no debería arrancar completamente.
    });


// 5. DEFINICIÓN DEL MODELO (Ajusta los campos si son diferentes)
const productSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    precio_regular: { type: Number, required: true },
    precio_oferta: { type: Number }, // Usado para mostrar el descuento
    descuento_porcentaje: { type: Number },
    imagen_url: { type: String },
    categoria: { type: String, required: true },
    es_oferta: { type: Boolean, default: false }
});

// El nombre de la colección debe ser 'products' (o 'productos' si usaste plural)
// Asegúrate que coincida con el nombre de tu colección en Atlas.
const Product = mongoose.model('Product', productSchema, 'products'); 


// 6. RUTAS DE LA API

// Ruta para obtener todos los productos
app.get('/api/productos', async (req, res) => {
    try {
        const productos = await Product.find({});
        res.status(200).json(productos);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener productos.' });
    }
});

// Ruta de prueba (opcional)
app.get('/', (req, res) => {
    res.send('Servidor de Licoreria El Buen Mártir funcionando.');
});


// 7. EXPORTAR LA APP (opcional, pero útil)
module.exports = app;
