import { useState } from 'react';
import axios from 'axios';

const Results = ({ results, onReset, styleType }) => {
  const [saving, setSaving] = useState({});
  const [saved, setSaved] = useState({});

  const handleSave = async (style, index) => {
    setSaving({ ...saving, [index]: true });

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.post(`${apiUrl}/api/saved`, {
        styleName: style.name,
        styleType: styleType,
        imageUrl: style.imageUrl,
        reason: style.reason,
        faceShape: results.faceShape,
        originalImageUrl: results.originalImage
      });

      setSaved({ ...saved, [index]: true });
      setTimeout(() => {
        setSaved({ ...saved, [index]: false });
      }, 2000);
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar estilo. Tente novamente.');
    } finally {
      setSaving({ ...saving, [index]: false });
    }
  };

  const getFaceShapeEmoji = (shape) => {
    const emojis = {
      'oval': '⚪',
      'quadrado': '⬜',
      'redondo': '⭕',
      'diamante': '💎',
      'triangular': '🔺',
      'retangular': '▭'
    };
    return emojis[shape] || '👤';
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <button
          onClick={onReset}
          className="px-6 py-2 bg-premium-gray hover:bg-premium-gray/80 border border-gold/30 rounded-lg text-gold font-medium transition-all duration-300 mb-4"
        >
          ← Nova Análise
        </button>
        
        <div className="bg-premium-gray/50 rounded-xl p-6 border border-gold/20 inline-block">
          <h2 className="text-2xl font-bold text-gold mb-2 font-elegant">
            Formato do Rosto Detectado
          </h2>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-4xl">{getFaceShapeEmoji(results.faceShape)}</span>
            <span className="text-xl font-semibold text-white capitalize">
              {results.faceShape}
            </span>
          </div>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-center mb-8 text-gradient font-elegant">
        Top 3 Recomendações
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {results.recommendations.map((style, index) => (
          <div
            key={index}
            className="bg-premium-gray/50 rounded-xl p-6 border border-gold/20 hover:border-gold/50 transition-all duration-300 hover:shadow-gold"
          >
            <div className="mb-4">
              <img
                src={style.imageUrl}
                alt={style.name}
                className="w-full h-64 object-cover rounded-lg mb-4"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x400/D4AF37/0A0A0A?text=Estilo+de+Referência';
                }}
              />
              <h3 className="text-xl font-bold text-gold mb-2 font-elegant">
                {style.name}
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                {style.reason}
              </p>
            </div>
            
            <button
              onClick={() => handleSave(style, index)}
              disabled={saving[index] || saved[index]}
              className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                saved[index]
                  ? 'bg-green-500/20 border border-green-500 text-green-400'
                  : saving[index]
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gold hover:bg-dark-gold text-premium-black hover:shadow-gold'
              }`}
            >
              {saved[index] ? '✓ Salvo!' : saving[index] ? 'Salvando...' : 'Salvar Estilo'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Results;

