//Atlas:
require('dotenv').config();

// Carga dependencias, librería express
const express = require('express');

//Ejecuta express
const api = express();

const port = process.env.PORT || 3000;

const path = require('path');

const cors = require('cors');

api.use(express.json());

api.use(cors());

//Servir el frontend
api.use(express.static(path.join(__dirname, '../frontend')));

//Conexión Atlas
const { MongoClient} = require('mongodb');

//Conexión Mongodb Atlas
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri);

//Variables globales para db y colección
let db, clientes;

//Función conectarDb
async function conectarDb() {
    
    try {
        
        // 1. Conectar a MongoDB
        await client.connect();

        // 2. Seleccionar base de datos
        db = client.db('clientes');

        // 3. Seleccionar colección
        clientes = db.collection('cliente');

        // 4. Cargar router y pasar colección
        const routerCliente = require('./routers/cliente.js')(clientes);

        // 5. Registrar router
        api.use('/api/clientes', routerCliente);


    } catch (error) {
        console.error('Error conectando a MongoDB', error);        
    }
}

//Iniciar conexión
conectarDb();

//Levantar server
api.listen(port, ()=>{
    console.log('servidor corriendo...');
    
})

