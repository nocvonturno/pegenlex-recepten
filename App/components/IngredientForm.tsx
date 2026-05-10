
import React, { useState, useEffect, useRef } from 'react';
import { Ingredient, RecipeUnit, VALID_UNITS } from '../types';
import { apiService } from '../apiService';

interface IngredientFormProps {
  ingredient?: Ingredient;
  onSave: (data: Partial<Ingredient>) => void;
  onCancel: () => void;
}

const IngredientForm: React.FC<IngredientFormProps> = ({ ingredient, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Ingredient>>(
    ingredient || {
      name: '',
      category: '',
      unit: 'gr',
      description: ''
    }
  );

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, category: value }));
    
    if (value.length > 0) {
      try {
        const results = await apiService.getCategoryAutocomplete(value);
        setSuggestions(results);
        setShowSuggestions(true);
      } catch (err) {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (suggestion: string) => {
    setFormData(prev => ({ ...prev, category: suggestion }));
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-300">
      <div className="bg-orange-500 p-6 text-white">
        <h2 className="text-2xl font-bold">{ingredient ? 'Ingrediënt Bewerken' : 'Nieuw Ingrediënt'}</h2>
        <p className="opacity-80 text-sm">Definieer de details van dit ingrediënt.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Naam</label>
          <input
            required
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            placeholder="Bijv. San Marzano Tomaten"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-orange-500 outline-none text-gray-900 font-medium"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative" ref={suggestionRef}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Categorie</label>
            <input
              required
              name="category"
              value={formData.category || ''}
              onChange={handleCategoryChange}
              onFocus={() => formData.category && suggestions.length > 0 && setShowSuggestions(true)}
              placeholder="Bijv. Groenten"
              autoComplete="off"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-orange-500 outline-none text-gray-900 font-medium"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => selectSuggestion(suggestion)}
                    className="px-4 py-2 hover:bg-orange-50 cursor-pointer text-gray-700 font-medium transition-colors border-b border-gray-50 last:border-0"
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Standaard Unit</label>
            <select
              name="unit"
              value={formData.unit || 'gr'}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-orange-500 outline-none text-gray-900 font-medium appearance-none"
            >
              {VALID_UNITS.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Omschrijving</label>
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            rows={3}
            placeholder="Korte beschrijving van het product..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-orange-500 outline-none text-gray-900"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 rounded-xl border border-gray-200 text-gray-500 font-semibold hover:bg-gray-50 transition-colors"
          >
            Annuleren
          </button>
          <button
            type="submit"
            className="px-8 py-2 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600 shadow-lg shadow-orange-100 transition-all hover:-translate-y-0.5"
          >
            Opslaan
          </button>
        </div>
      </form>
    </div>
  );
};

export default IngredientForm;
