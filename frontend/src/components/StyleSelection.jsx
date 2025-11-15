const StyleSelection = ({ selectedType, onSelect, onAnalyze, loading, error }) => {
  const options = [
    { id: 'cabelo', label: 'Apenas Cabelo', icon: '💇' },
    { id: 'barba', label: 'Apenas Barba', icon: '🧔' },
    { id: 'ambos', label: 'Cabelo + Barba', icon: '👨' }
  ];

  return (
    <div className="mb-8 animate-fade-in">
      <h2 className="text-2xl font-bold text-center mb-6 text-gold font-elegant">
        Escolha o que deseja analisar
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className={`p-6 rounded-xl border-2 transition-all duration-300 ${
              selectedType === option.id
                ? 'border-gold bg-gold/10 shadow-gold scale-105'
                : 'border-gold/30 bg-premium-gray/50 hover:border-gold/50 hover:bg-premium-gray/70'
            }`}
          >
            <div className="text-4xl mb-2">{option.icon}</div>
            <div className="font-semibold text-white">{option.label}</div>
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-center">
          {error}
        </div>
      )}

      <div className="text-center">
        <button
          onClick={onAnalyze}
          disabled={!selectedType || loading}
          className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
            selectedType && !loading
              ? 'bg-gradient-to-r from-gold to-dark-gold text-premium-black hover:shadow-gold hover:scale-105'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center space-x-2">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Analisando...</span>
            </span>
          ) : (
            'Analisar e Recomendar'
          )}
        </button>
      </div>
    </div>
  );
};

export default StyleSelection;

