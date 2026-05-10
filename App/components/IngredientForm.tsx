
import React, { useState } from 'react';
import { Ingredient, RecipeUnit, VALID_UNITS } from '../types';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
            value={formData.name}
            onChange={handleChange}
            placeholder="Bijv. San Marzano Tomaten"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-orange-500 outline-none text-gray-900 font-medium"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Categorie</label>
            <input
              required
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Bijv. Groenten"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-orange-500 outline-none text-gray-900 font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Standaard Unit</label>
            <select
              name="unit"
              value={formData.unit}
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
            value={formData.description}
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
