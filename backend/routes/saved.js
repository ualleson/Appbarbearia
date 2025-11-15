import express from 'express';
import SavedStyle from '../models/SavedStyle.js';

const router = express.Router();

// Salvar estilo favorito
router.post('/', async (req, res) => {
  try {
    const { styleName, styleType, imageUrl, reason, faceShape, originalImageUrl } = req.body;

    if (!styleName || !styleType || !imageUrl || !reason || !faceShape || !originalImageUrl) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const savedStyle = new SavedStyle({
      styleName,
      styleType,
      imageUrl,
      reason,
      faceShape,
      originalImageUrl
    });

    await savedStyle.save();

    res.json({ success: true, savedStyle });
  } catch (error) {
    console.error('Erro ao salvar estilo:', error);
    res.status(500).json({ error: 'Erro ao salvar estilo' });
  }
});

// Obter todos os estilos salvos
router.get('/', async (req, res) => {
  try {
    const savedStyles = await SavedStyle.find().sort({ createdAt: -1 });
    res.json({ success: true, styles: savedStyles });
  } catch (error) {
    console.error('Erro ao buscar estilos salvos:', error);
    res.status(500).json({ error: 'Erro ao buscar estilos salvos' });
  }
});

// Deletar estilo salvo
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await SavedStyle.findByIdAndDelete(id);
    res.json({ success: true, message: 'Estilo deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar estilo:', error);
    res.status(500).json({ error: 'Erro ao deletar estilo' });
  }
});

export default router;

