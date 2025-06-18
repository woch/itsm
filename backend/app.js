import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

import conocimientoRoutes from './routes/conocimiento.js'
import usuarioRoutes from './routes/usuarios.js'

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error MongoDB:', err))

app.use('/api/conocimiento', conocimientoRoutes)
app.use('/api/usuarios', usuarioRoutes)

const PORT = process.env.PORT || 5001
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
})