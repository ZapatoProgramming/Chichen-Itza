const { MongoClient, ObjectId } = require('mongodb'); // Asegúrate de usar ObjectId directamente

// Método genérico para insertar documentos
async function createDocument(client, databaseName, collectionName, document) {
    try {
        const database = client.db(databaseName); // Base de datos
        const collection = database.collection(collectionName); // Colección

        const resultado = await collection.insertOne(document);

        return resultado.insertedId; // Retorna el ID del documento insertado
    } catch (error) {
        console.error(`Error al insertar en la colección '${collectionName}':`, error);
        throw error; // Lanza el error para manejarlo externamente si es necesario
    }
}

// Método genérico para modificar documentos en una colección
async function modifyDocument(client, databaseName, collectionName, id, updatedFields) {
    try {
        const db = client.db(databaseName);
        const collection = db.collection(collectionName);

        // Valida y crea un ObjectId a partir del ID recibido
        const objectId = ObjectId.createFromHexString(id); // Crea un ObjectId a partir de un hex válido

        const resultado = await collection.updateOne(
            { _id: objectId }, // Busca por el ObjectId
            { $set: updatedFields } // Actualiza los campos proporcionados
        );

        if (resultado.matchedCount === 0) {
            throw new Error('Documento no encontrado');
        }

        return { success: true, message: 'Documento modificado exitosamente' };
    } catch (error) {
        console.error('Error al modificar el documento:', error);
        return { success: false, message: error.message };
    }
}

module.exports = { modifyDocument };


// Exporta las funciones
module.exports = { createDocument, modifyDocument };
