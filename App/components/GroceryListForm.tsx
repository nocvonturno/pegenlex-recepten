
import React, { useState } from 'react';
import { GroceryList } from '../types';

interface GroceryListFormProps {
  list?: GroceryList;
  onSave: (data: Partial<GroceryList>) => void;
  onCancel: () => void;
}

const GroceryListForm: React.FC<GroceryListFormProps> = ({ list, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<GroceryList>>(
    list || {
      name: '',
      description: '',
      active: true
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checkbox.checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-300">
      <div className="bg-orange-500 p-6 text-white">
        <h2 className="text-2xl font-bold">{list ? 'Lijst Bewerken' : 'Nieuwe Boodschappenlijst'}</h2>
        <p className="opacity-80 text-sm">Geef je lijst een naam en omschrijving.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Naam van de lijst</label>
          <input
            required
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Bijv. Wekelijkse boodschappen"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-orange-500 outline-none text-gray-900 font-medium"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Omschrijving (optioneel)</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Wat voor soort boodschappen zijn dit? Bijv. 'Ingrediënten voor pasta-vrijdag'."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-orange-500 outline-none text-gray-900 leading-relaxed"
          />
        </div>

        <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-2xl border border-orange-100">
          <div className="flex items-center h-5">
            <input
              id="active"
              name="active"
              type="checkbox"
              checked={formData.active}
              onChange={handleChange}
              className="w-5 h-5 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
            />
          </div>
          <div className="text-sm">
            <label htmlFor="active" className="font-bold text-gray-900 cursor-pointer">Lijst is actief</label>
            <p className="text-gray-500">Nog niet voltooide lijsten worden als 'Actief' gemarkeerd.</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
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
            Lijst Opslaan
          </button>
        </div>
      </form>
    </div>
  );
};

export default GroceryListForm;
