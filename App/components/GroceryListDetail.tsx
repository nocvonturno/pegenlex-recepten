
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GroceryList, GroceryListItem, Ingredient } from '../types';
import { apiService } from '../apiService';

interface GroceryListDetailProps {
  list: GroceryList;
  onBack: () => void;
}

const GroceryListDetail: React.FC<GroceryListDetailProps> = ({ list, onBack }) => {
  const [items, setItems] = useState<GroceryListItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // New Item states
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Ingredient[]>([]);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [newItemQty, setNewItemQty] = useState('1');
  const [newItemUnit, setNewItemUnit] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  // Drag and drop state
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  const fetchItems = useCallback(async () => {
    if (!list.id) return;
    setLoading(true);
    try {
      const data = await apiService.getGroceryListItems(list.id);
      // Ensure we always set an array
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch items:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [list.id]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Handle ingredient search
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }
    const handler = setTimeout(async () => {
      try {
        const res = await apiService.getIngredients({ page: 0, size: 10 }, searchQuery);
        setSuggestions(res.data || []);
      } catch (err) {
        console.error("Search failed:", err);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Click outside listener for suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectIngredient = (ing: Ingredient) => {
    setSelectedIngredient(ing);
    setSearchQuery(ing.name);
    setNewItemUnit(ing.unit);
    setShowSuggestions(false);
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!list.id || !selectedIngredient) return;
    
    try {
      // Use the bulk addition method even for single items to ensure it's wrapped in a list
      // as required by the groceryitemslist structure.
      await apiService.addGroceryListItemsBulk(list.id, [{
        ingredientId: selectedIngredient.id,
        name: selectedIngredient.name,
        quantity: parseFloat(newItemQty) || 1,
        unit: newItemUnit || selectedIngredient.unit
      }]);
      
      // Reset form
      setSearchQuery('');
      setSelectedIngredient(null);
      setNewItemQty('1');
      setNewItemUnit('');
      fetchItems();
    } catch (err) {
      alert('Fout bij toevoegen item');
    }
  };

  const handleToggleComplete = async (item: GroceryListItem) => {
    if (!list.id) return;
    try {
      await apiService.updateGroceryListItem(list.id, item.id, { completed: !item.completed });
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, completed: !item.completed } : i));
    } catch (err) {
      alert('Fout bij bijwerken item');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!list.id) return;
    try {
      await apiService.deleteGroceryListItem(list.id, itemId);
      setItems(prev => prev.filter(i => i.id !== itemId));
    } catch (err) {
      alert('Fout bij verwijderen item');
    }
  };

  // Drag and Drop Logic
  const handleDragStart = (index: number) => {
    setDraggedItemIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === index) return;

    const newItems = [...items];
    const draggedItem = newItems[draggedItemIndex];
    newItems.splice(draggedItemIndex, 1);
    newItems.splice(index, 0, draggedItem);
    
    setItems(newItems);
    setDraggedItemIndex(index);
  };

  const handleDragEnd = async () => {
    setDraggedItemIndex(null);
    if (!list.id) return;
    try {
      await apiService.reorderGroceryListItems(list.id, items.map(i => i.id));
    } catch (err) {
      console.error("Reorder failed on server:", err);
    }
  };

  // Safe access to items list
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-orange-600 transition-colors font-medium"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Terug naar overzicht
      </button>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-orange-500 p-8 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-black">{list.name}</h2>
              <p className="opacity-80 mt-1 italic">{list.description}</p>
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-2xl backdrop-blur-sm">
              <span className="text-sm font-bold">{safeItems.filter(i => i.completed).length}/{safeItems.length} klaar</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="relative mb-8" ref={suggestionRef}>
            <form onSubmit={handleAddItem} className="flex gap-2 bg-gray-50 p-3 rounded-2xl border border-gray-200">
              <div className="flex-grow relative">
                <input 
                  type="text"
                  required
                  value={searchQuery}
                  onFocus={() => setShowSuggestions(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (selectedIngredient && e.target.value !== selectedIngredient.name) {
                      setSelectedIngredient(null);
                    }
                    setShowSuggestions(true);
                  }}
                  className={`w-full bg-white border rounded-xl py-2 px-4 text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all ${
                    selectedIngredient ? 'border-orange-500 font-bold text-orange-700 bg-orange-50' : 'border-gray-200 text-gray-900'
                  }`}
                  placeholder="Zoek ingrediënt..."
                />
                {selectedIngredient && (
                  <button 
                    type="button" 
                    onClick={() => {setSelectedIngredient(null); setSearchQuery('');}}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                  </button>
                )}
              </div>
              <input 
                type="number"
                step="0.1"
                value={newItemQty}
                onChange={(e) => setNewItemQty(e.target.value)}
                className="w-16 bg-white border border-gray-200 rounded-xl py-2 px-2 text-center text-sm font-bold focus:ring-2 focus:ring-orange-500 outline-none text-gray-900"
                placeholder="Aantal"
              />
              <input 
                type="text"
                value={newItemUnit}
                onChange={(e) => setNewItemUnit(e.target.value)}
                className="w-20 bg-white border border-gray-200 rounded-xl py-2 px-2 text-center text-sm focus:ring-2 focus:ring-orange-500 outline-none text-gray-500 font-medium"
                placeholder="Unit"
              />
              <button 
                type="submit"
                disabled={!selectedIngredient}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm ${
                  selectedIngredient ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-100 rounded-2xl shadow-xl z-20 max-h-60 overflow-y-auto overflow-x-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                {suggestions.map(ing => (
                  <button
                    key={ing.id}
                    type="button"
                    onClick={() => handleSelectIngredient(ing)}
                    className="w-full text-left px-5 py-3 hover:bg-orange-50 flex items-center justify-between group transition-colors border-b last:border-0 border-gray-50"
                  >
                    <div>
                      <div className="font-bold text-gray-900 group-hover:text-orange-600">{ing.name}</div>
                      <div className="text-xs text-gray-400">{ing.category}</div>
                    </div>
                    <span className="text-[10px] font-black uppercase text-gray-300 group-hover:text-orange-300">Standaard: {ing.unit}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {loading ? (
            <div className="py-12 text-center text-gray-400 italic flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <span>Laden...</span>
            </div>
          ) : safeItems.length === 0 ? (
            <div className="py-12 text-center text-gray-400 italic">De lijst is nog leeg.</div>
          ) : (
            <div className="space-y-2">
              {safeItems.map((item, index) => (
                <div 
                  key={item.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-2 p-4 rounded-2xl border transition-all ${
                    draggedItemIndex === index ? 'opacity-50 scale-95 border-orange-500 bg-orange-50' : 'bg-white border-gray-100 hover:border-orange-100 shadow-sm'
                  } group`}
                >
                  <div className="cursor-grab active:cursor-grabbing text-gray-300 group-hover:text-gray-400 flex-shrink-0 p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                  </div>

                  <div 
                    onClick={() => handleToggleComplete(item)}
                    className={`flex-grow flex items-center justify-between gap-3 overflow-hidden cursor-pointer select-none py-1 active:scale-[0.98] transition-transform ${item.completed ? 'opacity-50' : ''}`}
                    role="button"
                    aria-label={`Markeer ${item.ingredient.name} als ${item.completed ? 'niet voltooid' : 'voltooid'}`}
                  >
                    <div className="flex flex-col overflow-hidden flex-grow">
                      <div className="flex items-center gap-1.5 overflow-hidden">
                        <span className={`text-gray-900 font-bold truncate ${item.completed ? 'line-through text-gray-400' : ''}`}>
                          {item.ingredient.name}
                        </span>
                        {item.completed && (
                          <div className="flex-shrink-0 text-green-500">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      {!item.completed && (
                        <span className="text-[10px] text-gray-400 uppercase tracking-tight">{item.ingredient.category}</span>
                      )}
                    </div>
                    <span className={`font-black text-orange-500 whitespace-nowrap text-right min-w-[3.5rem] ${item.completed ? 'line-through opacity-30' : ''}`}>
                      {item.quantity} <span className="text-[10px] uppercase font-bold">{item.unit}</span>
                    </span>
                  </div>

                  <button 
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all flex-shrink-0"
                    aria-label={`Verwijder ${item.ingredient.name}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroceryListDetail;
