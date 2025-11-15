import { useState, useEffect } from 'react';
import axios from 'axios';

const SavedStyles = ({ onBack }) => {
  const [styles, setStyles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSavedStyles();
  }, []);

  const fetchSavedStyles = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${apiUrl}/api/saved`);
      setStyles(response.data.styles);
    } catch (err) {
      setError('Erro ao carregar estilos salvos');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deseja realmente deletar este estilo salvo?')) {
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.delete(`${apiUrl}/api/saved/${id}`);
      fetchSavedStyles();
    } catch (err) {
      alert('Erro ao deletar estilo');
      console.error('Erro:', err);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin h-12 w-12 border-4 border-gold border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-400">Carregando estilos salvos...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gradient font-elegant">
          Estilos Salvos
        </h1>
        <button
          onClick={onBack}
          className="px-6 py-2 bg-premium-gray hover:bg-premium-gray/80 border border-gold/30 rounded-lg text-gold font-medium transition-all duration-300"
        >
          ← Voltar
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-center">
          {error}
        </div>
      )}

      {styles.length === 0 ? (
        <div className="text-center py-12 bg-premium-gray/50 rounded-xl border border-gold/20">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-gray-400 text-lg">Nenhum estilo salvo ainda</p>
          <p className="text-gray-500 text-sm mt-2">Salve seus estilos favoritos para consultá-los depois</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {styles.map((style) => (
            <div
              key={style._id}
              className="bg-premium-gray/50 rounded-xl p-6 border border-gold/20 hover:border-gold/50 transition-all duration-300"
            >
              <img
                src={style.imageUrl}
                alt={style.styleName}
                className="w-full h-48 object-cover rounded-lg mb-4"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x400/D4AF37/0A0A0A?text=Estilo+de+Referência';
                }}
              />
              <h3 className="text-xl font-bold text-gold mb-2 font-elegant">
                {style.styleName}
              </h3>
              <div className="mb-2">
                <span className="inline-block px-2 py-1 bg-gold/20 text-gold text-xs rounded">
                  {style.styleType}
                </span>
                <span className="inline-block px-2 py-1 bg-gold/20 text-gold text-xs rounded ml-2">
                  {style.faceShape}
                </span>
              </div>
              <p className="text-gray-300 text-sm mb-4">
                {style.reason}
              </p>
              <button
                onClick={() => handleDelete(style._id)}
                className="w-full py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 rounded-lg font-medium transition-all duration-300"
              >
                Deletar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedStyles;

