const Header = ({ onShowSaved }) => {
  return (
    <header className="bg-premium-black/80 backdrop-blur-sm border-b border-gold/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-gold to-dark-gold rounded-lg flex items-center justify-center">
            <span className="text-premium-black font-bold text-xl">✂️</span>
          </div>
          <h1 className="text-2xl font-bold text-gradient font-elegant">
            Barbearia AI
          </h1>
        </div>
        <button
          onClick={onShowSaved}
          className="px-4 py-2 bg-gold/10 hover:bg-gold/20 border border-gold/30 rounded-lg text-gold font-medium transition-all duration-300 hover:shadow-gold"
        >
          Estilos Salvos
        </button>
      </div>
    </header>
  );
};

export default Header;

