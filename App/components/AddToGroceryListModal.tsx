
import React, { useState, useEffect } from 'react';
import { GroceryList, RecipeIngredient } from '../types';
import { apiService } from '../apiService';

interface AddToGroceryListModalProps {
  ingredients: RecipeIngredient[];
  onClose: () => void;
}

const AddToGroceryListModal: React.FC<AddToGroceryListModalProps> = ({ ingredients, onClose }) => {
  const [lists, setLists] = useState<GroceryList[]>([]);
  const [selectedListId, setSelectedListId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const res = await apiService.getGroceryLists({ page: 0, size: 50 });
        const activeLists = res.data.filter(l => l.active);
        setLists(activeLists);
        if (activeLists.length > 0) {
          setSelectedListId(activeLists[0].id || '');
        }
      } catch (err) {
        console.error("Failed to fetch lists", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLists();
  }, []);

  const handleAdd = async () => {
    if (!selectedListId || ingredients.length === 0) return;
    setSaving(true);
    setStatus('idle');
    try {
      const itemsPayload = ingredients.map(ri => ({
        ingredientId: ri.ingredient.id,
        name: ri.ingredient.name,
        quantity: ri.quantity,
        unit: ri.unit
      }));
      await apiService.addGroceryListItemsBulk(selectedListId, itemsPayload);
      setStatus('success');
      setTimeout(onClose, 1500);
    } catch (err) {
      console.error("Failed to add bulk items", err);
      setStatus('error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-orange-500 p-6 text-white">
          <h3 className="text-xl font-black">Toevoegen aan lijst</h3>
          <p className="opacity-80 text-sm">Selecteer een boodschappenlijst voor deze ingrediënten.</p>
        </div>

        <div className="p-6 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <span className="text-gray-400 italic">Lijsten ophalen...</span>
            </div>
          ) : lists.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Geen actieve lijsten gevonden.</p>
              <button 
                onClick={onClose}
                className="text-orange-600 font-bold hover:underline"
              >
                Sluiten
              </button>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Kies een lijst</label>
                <select 
                  value={selectedListId}
                  onChange={(e) => setSelectedListId(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 font-bold appearance-none"
                >
                  {lists.map(list => (
                    <option key={list.id} value={list.id}>{list.name}</option>
                  ))}
                </select>
              </div>

              <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                <span className="text-[10px] font-black text-orange-400 uppercase block mb-2 tracking-widest">Inhoud ({ingredients.length} items)</span>
                <div className="max-h-32 overflow-y-auto space-y-1 pr-2">
                  {ingredients.map((ri, i) => (
                    <div key={i} className="text-sm flex justify-between">
                      <span className="text-gray-700">{ri.ingredient.name}</span>
                      <span className="font-bold text-orange-600">{ri.quantity} {ri.unit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={onClose}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-500 font-bold hover:bg-gray-50 transition-colors"
                >
                  Annuleren
                </button>
                <button 
                  onClick={handleAdd}
                  disabled={saving || status === 'success'}
                  className={`flex-[2] px-4 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
                    status === 'success' ? 'bg-green-500 text-white shadow-green-100' :
                    status === 'error' ? 'bg-red-500 text-white shadow-red-100' :
                    'bg-orange-500 text-white hover:bg-orange-600 shadow-orange-100'
                  }`}
                >
                  {saving ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : status === 'success' ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                      Toegevoegd!
                    </>
                  ) : status === 'error' ? (
                    'Fout opgetreden'
                  ) : (
                    'Nu toevoegen'
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddToGroceryListModal;
