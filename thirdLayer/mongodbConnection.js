const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority";

const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        console.log("Conectado a MongoDB!");

        const database = client.db('miBaseDeDatos');
        const collection = database.collection('miColeccion');

        // Consulta ejemplo
        const documentos = await collection.find({ activo: true }).toArray();
        console.log(documentos);

    } finally {
        await client.close();
    }
}

run().catch(console.error);
