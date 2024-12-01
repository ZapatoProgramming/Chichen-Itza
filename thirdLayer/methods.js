const { ObjectId } = require('mongodb');

/**
 * Crea un nuevo documento en la base de datos.
 * 
 * @param {MongoClient} client - Instancia del cliente MongoDB.
 * @param {string} databaseName - Nombre de la base de datos.
 * @param {string} collectionName - Nombre de la colección.
 * @param {Object} document - Documento a insertar.
 * 
 * @returns {Object} Resultado de la operación con éxito o error.
 */
async function createDocument(client, databaseName, collectionName, document) {
    try {
        const db = client.db(databaseName);
        const collection = db.collection(collectionName);

        const resultado = await collection.insertOne(document);
        console.log(`Documento insertado en '${collectionName}' con ID: ${resultado.insertedId}`);

        return { success: true, insertedId: resultado.insertedId };
    } catch (error) {
        console.error(`Error al insertar en la colección '${collectionName}':`, error);
        return { success: false, message: error.message };
    }
}

/**
 * Modifica un documento existente en la base de datos.
 * 
 * @param {MongoClient} client - Instancia del cliente MongoDB.
 * @param {string} databaseName - Nombre de la base de datos.
 * @param {string} collectionName - Nombre de la colección.
 * @param {string} id - ID del documento a modificar.
 * @param {Object} updatedFields - Campos a actualizar en el documento.
 * 
 * @returns {Object} Resultado de la operación con éxito o error.
 */
async function modifyDocument(client, databaseName, collectionName, id, updatedFields) {
    try {
        const db = client.db(databaseName);
        const collection = db.collection(collectionName);

        // Valida que el ID sea un ObjectId válido
        if (!ObjectId.isValid(id)) {
            throw new Error('ID inválido');
        }

        // Actualiza el documento
        const resultado = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedFields }
        );

        if (resultado.matchedCount === 0) {
            return { success: false, message: 'Documento no encontrado' };
        }

        return { success: true, message: 'Documento modificado exitosamente', modifiedCount: resultado.modifiedCount };
    } catch (error) {
        console.error('Error al modificar el documento:', error);
        return { success: false, message: error.message };
    }
}

module.exports = { createDocument, modifyDocument };
