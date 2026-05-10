
import React, { useState, useEffect } from 'react';
import { Ingredient, RecipeIngredient } from '../types';
import { apiService } from '../apiService';
import AddToGroceryListModal from './AddToGroceryListModal';

interface IngredientManagerProps {
  isMockMode: boolean;
  onEditIngredient: (ing: Ingredient) => void;
  onReload: () => void;
  onCreateIngredient: () => void;
}

const IngredientManager: React.FC<IngredientManagerProps> = ({ 
  isMockMode, 
  onEditIngredient, 
  onReload,
  onCreateIngredient 
}) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedForList, setSelectedForList] = useState<RecipeIngredient[] | null>(null);

  const fetchIngredients = async (currentSearchTerm: string) => {
    setLoading(true);
    try {
      const response = await apiService.getIngredients({ page: 0, size: 100 }, currentSearchTerm);
      setIngredients(response.data);
    } catch (err) {
      console.error("Failed to fetch ingredients:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchIngredients(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    fetchIngredients(searchTerm);
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Weet je zeker dat je dit ingrediënt wilt verwijderen?')) return;
    try {
      await apiService.deleteIngredient(id);
      fetchIngredients(searchTerm);
    } catch (err) {
      alert('Fout bij verwijderen.');
      console.error(err);
    }
  };

  const handleAddToList = (ing: Ingredient) => {
    // Wrap the single ingredient in the expected format for the modal
    const item: RecipeIngredient = {
      ingredient: ing,
      quantity: 1,
      unit: ing.unit
    };
    setSelectedForList([item]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Ingrediënten Beheer</h2>
          <p className="text-gray-500 text-sm">Beheer de basis ingrediënten voor je recepten.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Filter ingrediënten..." 
              className="bg-white border border-gray-200 rounded-xl py-2 px-4 pl-10 focus:ring-2 focus:ring-orange-500 outline-none text-sm text-gray-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <button 
            onClick={onCreateIngredient}
            className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-orange-600 transition-colors"
          >
            Nieuw
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Naam</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest hidden sm:table-cell">Categorie</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Unit</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={4} className="p-12 text-center text-gray-400 italic">Laden ingrediënten...</td></tr>
              ) : ingredients.length === 0 ? (
                <tr><td colSpan={4} className="p-12 text-center text-gray-400 italic">Geen ingrediënten gevonden.</td></tr>
              ) : (
                ingredients.map(ing => (
                  <tr key={ing.id} className="hover:bg-orange-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{ing.name}</div>
                      <div className="text-xs text-gray-500 line-clamp-1">{ing.description}</div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-[10px] font-bold uppercase">
                        {ing.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-orange-600 font-mono">{ing.unit}</span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-1 sm:space-x-2">
                      <button 
                        onClick={() => handleAddToList(ing)}
                        className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-100 rounded-lg transition-colors"
                        title="Toevoegen aan lijst"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => onEditIngredient(ing)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Bewerken"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleDelete(ing.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Verwijderen"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedForList && (
        <AddToGroceryListModal 
          ingredients={selectedForList}
          onClose={() => setSelectedForList(null)}
        />
      )}
    </div>
  );
};

export default IngredientManager;
