const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://danielmaimone03:_tf6MSe7mW9vapX@chichenitza.odfli.mongodb.net/?retryWrites=true&w=majority&appName=ChichenItza";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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
