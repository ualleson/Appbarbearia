import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyzeFaceAndRecommend } from '../services/aiService.js';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configurar multer para upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Apenas imagens JPG, JPEG ou PNG são permitidas!'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: fileFilter
});

// Rota de upload e análise
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhuma imagem enviada' });
    }

    const { styleType } = req.body; // 'cabelo', 'barba', ou 'ambos'

    if (!styleType || !['cabelo', 'barba', 'ambos'].includes(styleType)) {
      return res.status(400).json({ error: 'Tipo de estilo inválido. Use: cabelo, barba ou ambos' });
    }

    // Processar imagem (redimensionar se necessário)
    const processedImagePath = `uploads/processed-${req.file.filename}`;
    await sharp(req.file.path)
      .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 90 })
      .toFile(processedImagePath);

    // Analisar rosto e obter recomendações
    const recommendations = await analyzeFaceAndRecommend(
      processedImagePath,
      styleType
    );

    // URL da imagem original
    const originalImageUrl = `/uploads/${req.file.filename}`;

    res.json({
      success: true,
      originalImage: originalImageUrl,
      faceShape: recommendations.faceShape,
      recommendations: recommendations.styles
    });

  } catch (error) {
    console.error('Erro ao processar upload:', error);
    res.status(500).json({
      error: 'Erro ao processar imagem',
      message: error.message
    });
  }
});

export default router;

