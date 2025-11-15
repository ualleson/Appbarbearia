import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import uploadRoutes from './routes/upload.js';
import stylesRoutes from './routes/styles.js';
import savedRoutes from './routes/saved.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir uploads estáticos
app.use('/uploads', express.static('uploads'));

// Rotas
app.use('/api/upload', uploadRoutes);
app.use('/api/styles', stylesRoutes);
app.use('/api/saved', savedRoutes);

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API funcionando' });
});

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/barbearia')
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.error('❌ Erro ao conectar MongoDB:', err));

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando em http://0.0.0.0:${PORT}`);
});

export default app;

