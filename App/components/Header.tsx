
import React from 'react';

interface HeaderProps {
  onSearch: (val: string) => void;
  onCreate: () => void;
  onHome: () => void;
  onIngredients: () => void;
  onGroceryLists: () => void;
  isMockMode?: boolean;
  currentView: string;
}

const Header: React.FC<HeaderProps> = ({ 
  onSearch, 
  onCreate, 
  onHome, 
  onIngredients, 
  onGroceryLists,
  isMockMode,
  currentView
}) => {
  const isIngredientsView = currentView === 'ingredients';
  const isGroceryView = currentView.startsWith('grocery');

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div 
          className="flex items-center gap-2 cursor-pointer group" 
          onClick={onHome}
        >
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-1.551-2.457A3.75 3.75 0 0012 18z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-gray-900 leading-none">PegEnLex</h1>
            {isMockMode && (
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-tighter mt-0.5">Demo Mode</span>
            )}
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
          <button 
            onClick={onHome}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              currentView === 'list' || currentView === 'detail' || currentView === 'create' || currentView === 'edit' 
              ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Recepten
          </button>
          <button 
            onClick={onIngredients}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              isIngredientsView ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Ingrediënten
          </button>
          <button 
            onClick={onGroceryLists}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              isGroceryView ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Boodschappen
          </button>
        </nav>

        {!isIngredientsView && !isGroceryView && (
          <div className="flex-grow max-w-md relative">
            <input 
              type="text" 
              placeholder="Zoek recepten..." 
              className="w-full bg-gray-100 border-none rounded-full py-2 px-5 pl-12 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all text-sm text-gray-900 placeholder-gray-500"
              onChange={(e) => onSearch(e.target.value)}
            />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
        )}

        <button 
          onClick={onCreate}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-full shadow-md transition-colors flex items-center gap-2 text-sm whitespace-nowrap"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span className="hidden sm:inline">
            {isIngredientsView ? 'Ingrediënt' : isGroceryView ? 'Lijst' : 'Recept'} toevoegen
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;
