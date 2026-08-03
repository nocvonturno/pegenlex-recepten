
import React from 'react';

interface MobileNavProps {
  currentView: string;
  onHome: () => void;
  onIngredients: () => void;
  onGroceryLists: () => void;
  onNotes: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({
  currentView,
  onHome,
  onIngredients,
  onGroceryLists,
  onNotes
}) => {
  const isRecipes = currentView === 'list' || currentView === 'detail' || currentView === 'create' || currentView === 'edit';
  const isIngredients = currentView.startsWith('ingredient');
  const isGrocery = currentView.startsWith('grocery');
  const isNotes = currentView.startsWith('note');

  const navItemClass = (isActive: boolean) => `
    flex flex-col items-center justify-center flex-1 gap-1 transition-all duration-300
    ${isActive ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600'}
  `;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 h-20 px-6 flex items-center justify-around z-40 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)]">
      <button 
        onClick={onHome}
        className={navItemClass(isRecipes)}
      >
        <div className={`p-2 rounded-xl transition-colors ${isRecipes ? 'bg-orange-50' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
        </div>
        <span className="text-[10px] font-black uppercase tracking-wider">Recepten</span>
      </button>

      <button 
        onClick={onIngredients}
        className={navItemClass(isIngredients)}
      >
        <div className={`p-2 rounded-xl transition-colors ${isIngredients ? 'bg-orange-50' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
          </svg>
        </div>
        <span className="text-[10px] font-black uppercase tracking-wider">Ingrediënten</span>
      </button>

      <button
        onClick={onGroceryLists}
        className={navItemClass(isGrocery)}
      >
        <div className={`p-2 rounded-xl transition-colors ${isGrocery ? 'bg-orange-50' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        </div>
        <span className="text-[10px] font-black uppercase tracking-wider">Boodschappen</span>
      </button>

      <button
        onClick={onNotes}
        className={navItemClass(isNotes)}
      >
        <div className={`p-2 rounded-xl transition-colors ${isNotes ? 'bg-orange-50' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <span className="text-[10px] font-black uppercase tracking-wider">Notities</span>
      </button>
    </nav>
  );
};

export default MobileNav;
