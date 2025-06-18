# Backend ITSM Retail - Base de Conocimiento

### ▶️ Ejecutar

1. Instala las dependencias:
```bash
npm install
```

2. Crea un archivo `.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/itsm_retail
```

3. Inicia el servidor:
```bash
npm run dev
```

### Endpoints disponibles:
- `GET /api/conocimiento`
- `POST /api/conocimiento`
- `PUT /api/conocimiento/:id`
- `DELETE /api/conocimiento/:id`