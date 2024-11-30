const connectToDB = require('./mongodbConnection.js');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;
let db;

app.use(cors());
app.use(bodyParser.json());
let clientValue = null;

// Conectar a la base de datos antes de iniciar el servidor
async function initializeServer() {
    try {
        clientValue = await connectToDB();
        db = clientValue.db("ChichenItza"); // Cambia por el nombre de tu base de datos
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

const { modifyDocument } = require('./methods.js');

//Endpoint para modificar un participante
app.put('/api/participantes', async (req, res) => {
    const { id, name, avatar } = req.body;

    try {
        const updatedFields = {};
        if (name) updatedFields.name = name;
        if (avatar) updatedFields.avatar = avatar;

        const resultado = await modifyDocument(
            clientValue,               // Cliente MongoDB conectado
            'ChichenItza',        // Nombre de la base de datos
            'users',              // Nombre de la colección
            id,                   // ID del participante
            updatedFields         // Campos a actualizar
        );

        if (resultado.success) {
            res.status(200).json(resultado);
        } else {
            res.status(404).json(resultado);
        }
    } catch (error) {
        console.error('Error al actualizar el participante:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

// Endpoint para obtener la lista de participantes
app.get('/api/participantes', async (req, res) => {
    try {
        const usuarios = db.collection('users'); // Colección de usuarios
        const participantes = await usuarios.find({ role: 'participant' }).toArray(); // Filtra por rol 'participant'

        res.status(200).json(participantes); // Envía la lista de participantes como respuesta JSON
    } catch (error) {
        console.error('Error al obtener la lista de participantes:', error);
        res.status(500).json({ success: false, message: 'Error al obtener la lista de participantes' });
    }
});

// Endpoint para obtener la lista de guias
app.get('/api/guias', async (req, res) => {
    try {
        const usuarios = db.collection('users'); // Colección de usuarios
        const participantes = await usuarios.find({ role: 'guide' }).toArray(); // Filtra por rol 'participant'

        res.status(200).json(participantes); // Envía la lista de participantes como respuesta JSON
    } catch (error) {
        console.error('Error al obtener la lista de participantes:', error);
        res.status(500).json({ success: false, message: 'Error al obtener la lista de participantes' });
    }
});

const { ObjectId } = require('mongodb');

//delete a participant
app.delete('/api/participantes/:id', async (req, res) => {
    const { id } = req.params; // Obtén el ID del participante de los parámetros de la URL

    try {
        const usuarios = db.collection('users'); // Colección de usuarios

        // Valida que el ID sea un ObjectId válido
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'ID inválido' });
        }

        // Elimina el participante
        const resultado = await usuarios.deleteOne({ _id: new ObjectId(id) });

        if (resultado.deletedCount === 0) {
            return res.status(404).json({ success: false, message: 'Participante no encontrado' });
        }

        res.status(200).json({ success: true, message: 'Participante eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar el participante:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

// Endpoint para crear guia
app.post('/api/guias', async (req, res) => {
    const { nombre, role } = req.body; // Obtén el nombre del cuerpo de la solicitud

    try {
        // Valida que el nombre no esté vacío
        if (!nombre) {
            return res.status(400).json({ success: false, message: 'El nombre es obligatorio' });
        }

        const guias = db.collection('users'); // Colección para almacenar guías

        // Inserta el nuevo guía en la base de datos
        const resultado = await guias.insertOne({ nombre, role });

        res.status(201).json({ success: true, message: 'Guía registrado exitosamente', id: resultado.insertedId });
    } catch (error) {
        console.error('Error al registrar el guía:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});


// Inicializa la conexión y el servidor
initializeServer();