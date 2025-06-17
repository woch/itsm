const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let db;

async function conectarMongo() {
  try {
    await client.connect();
    console.log("✅ Conectado a MongoDB Atlas");
    db = client.db(process.env.DB_NAME);
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
