const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://danielmaimone03:_tf6MSe7mW9vapX@chichenitza.odfli.mongodb.net/?retryWrites=true&w=majority&appName=ChichenItza"; 

// Crea un cliente MongoClient con la API estable
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function connectToDB() {
    try {
        await client.connect();
        console.log("Conectado a MongoDB");
        return client;
    } catch (error) {
        console.error("Error:", error);
    }
}

module.exports = connectToDB;
