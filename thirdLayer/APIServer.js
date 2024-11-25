const connectToDB = require('./mongodbConnection.js');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;
let db;

app.use(cors());
app.use(bodyParser.json());

// Conectar a la base de datos antes de iniciar el servidor
async function initializeServer() {
    try {
        const client = await connectToDB();
        db = client.db("ChichenItza"); // Cambia por el nombre de tu base de datos
        console.log("Conexión a la base de datos establecida");

        // Inicia el servidor Express
        app.listen(PORT, () => {
            console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error);
        process.exit(1); // Detén el proceso si no se puede conectar
    }
}

// Endpoint para verificar credenciales
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const usuarios = db.collection('users'); // Colección donde están los usuarios
        const user = await usuarios.findOne({ username, password });

        if (user) {
            res.status(200).json({ success: true, user: { id: user._id, role: user.role } });
        } else {
            res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }
    } catch (error) {
        console.error("Error al verificar credenciales:", error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

// Endpoint para crear un nuevo usuario
app.post('/api/users', async (req, res) => {
    const { adminUsername, adminPassword, newUser } = req.body;

    try {
        const usuarios = db.collection('users'); // Colección donde están los usuarios

        // Verifica si el usuario que realiza la solicitud es un administrador
        const admin = await usuarios.findOne({ username: adminUsername, password: adminPassword, role: 'admin' });

        if (!admin) {
            return res.status(403).json({ success: false, message: 'No tienes permiso para realizar esta acción' });
        }

        // Inserta el nuevo usuario en la base de datos
        const resultado = await usuarios.insertOne(newUser);
        res.status(201).json({ success: true, insertedId: resultado.insertedId });
    } catch (error) {
        console.error("Error al crear un usuario:", error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

// Inicializa la conexión y el servidor
initializeServer();
