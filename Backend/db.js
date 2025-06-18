// db.js
const { MongoClient } = require("mongodb");

<<<<<<< HEAD
const uri = process.env.MONGO_URI;
=======
const uri = "mongodb+srv://DBPROYEC:CEUTEC123@clusterante.3gcar2d.mongodb.net/?retryWrites=true&w=majority";
>>>>>>> main
const client = new MongoClient(uri);
let db;

async function conectarMongo() {
  try {
    await client.connect();
    console.log("✅ Conectado a MongoDB Atlas");
<<<<<<< HEAD
    db = client.db(process.env.DB_NAME);
=======
    db = client.db("itsm"); // Conexión con la base de datos 'itsm'
>>>>>>> main
    return db;
  } catch (e) {
    console.error("❌ Error al conectar:", e);
  }
}

function getDB() {
  if (!db) throw new Error("La base de datos no está conectada.");
  return db;
}

module.exports = { conectarMongo, getDB };