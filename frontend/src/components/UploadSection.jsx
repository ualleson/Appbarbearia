import { useRef } from 'react';

const UploadSection = ({ selectedImage, onImageSelect, onReset }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image/(jpeg|jpg|png)')) {
        alert('Por favor, selecione uma imagem JPG, JPEG ou PNG');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 10MB');
        return;
      }
      onImageSelect(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange({ target: { files: [file] } });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="mb-8 animate-fade-in">
      <div
        className="border-2 border-dashed border-gold/30 rounded-2xl p-8 md:p-12 text-center bg-premium-gray/50 hover:bg-premium-gray/70 transition-all duration-300 cursor-pointer hover:border-gold/50 hover:shadow-gold"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => !selectedImage && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          onChange={handleFileChange}
          className="hidden"
        />

        {selectedImage ? (
          <div className="space-y-4">
            <div className="relative inline-block">
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Preview"
                className="max-w-full max-h-96 rounded-lg shadow-gold mx-auto"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReset();
                }}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition-all"
              >
                ×
              </button>
            </div>
            <p className="text-gold font-medium">Imagem selecionada: {selectedImage.name}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-6xl mb-4">📸</div>
            <h3 className="text-2xl font-bold text-gold mb-2">Envie sua foto</h3>
            <p className="text-gray-400 mb-4">
              Arraste e solte uma imagem aqui ou clique para selecionar
            </p>
            <p className="text-sm text-gray-500">
              Formatos aceitos: JPG, JPEG, PNG (máx. 10MB)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadSection;

