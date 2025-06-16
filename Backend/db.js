const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://DBPROYEC:CEUTEC123@clusterante.3gcar2d.mongodb.net/?retryWrites=true&w=majority&appName=ClusterAnte";
const client = new MongoClient(uri);

let db;

async function conectarMongo() {
  try {
    await client.connect();
    console.log("✅ Conectado a MongoDB Atlas");
    db = client.db("itsm");
    return db;
  } catch (e) {
    console.error("❌ Error al conectar:", e);
  }
}

function getDB() {
  if (!db) throw new Error("La base de datos no está conectada.");
  return db;
}

module.exports = { conectarMongo, getDB };
