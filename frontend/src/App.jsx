import { useState } from 'react';
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import StyleSelection from './components/StyleSelection';
import Results from './components/Results';
import SavedStyles from './components/SavedStyles';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [styleType, setStyleType] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSaved, setShowSaved] = useState(false);

  const handleImageUpload = (file) => {
    setSelectedImage(file);
    setResults(null);
    setError(null);
  };

  const handleStyleTypeSelect = (type) => {
    setStyleType(type);
  };

  const handleAnalyze = async () => {
    if (!selectedImage || !styleType) {
      setError('Por favor, selecione uma imagem e um tipo de estilo');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('photo', selectedImage);
      formData.append('styleType', styleType);

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao processar imagem');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message || 'Erro ao analisar imagem. Tente novamente.');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setStyleType(null);
    setResults(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-premium-black via-premium-gray to-premium-black">
      <Header onShowSaved={() => setShowSaved(!showSaved)} />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {showSaved ? (
          <SavedStyles onBack={() => setShowSaved(false)} />
        ) : (
          <>
            {!results ? (
              <>
                <div className="text-center mb-12 animate-fade-in">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient font-elegant">
                    Descubra Seu Estilo Perfeito
                  </h1>
                  <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
                    Nossa inteligência artificial analisa o formato do seu rosto e sugere os melhores cortes de cabelo e barba para você
                  </p>
                </div>

                <UploadSection
                  selectedImage={selectedImage}
                  onImageSelect={handleImageUpload}
                  onReset={handleReset}
                />

                {selectedImage && (
                  <StyleSelection
                    selectedType={styleType}
                    onSelect={handleStyleTypeSelect}
                    onAnalyze={handleAnalyze}
                    loading={loading}
                    error={error}
                  />
                )}
              </>
            ) : (
              <Results
                results={results}
                onReset={handleReset}
                styleType={styleType}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;

