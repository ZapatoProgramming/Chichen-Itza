export async function createDocument(client, databaseName, collectionName, document) {
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
