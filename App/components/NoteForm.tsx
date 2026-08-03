import React, { useState } from 'react';
import { Note } from '../types';

interface NoteFormProps {
  note?: Note;
  onSave: (data: Partial<Note>) => void;
  onCancel: () => void;
}

const NoteForm: React.FC<NoteFormProps> = ({ note, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Note>>(
    note || {
      title: '',
      content: ''
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const charCount = formData.content?.length || 0;
  const maxChars = 2000;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-300">
      <div className="bg-orange-500 p-6 text-white">
        <h2 className="text-2xl font-bold">{note ? 'Notitie Bewerken' : 'Nieuwe Notitie'}</h2>
        <p className="opacity-80 text-sm">Geef je notitie een titel en schrijf je gedachten.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Titel</label>
          <input
            required
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Bijv. Boodschappenlijst week 1"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-orange-500 outline-none text-gray-900 font-medium"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Inhoud</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={10}
            maxLength={maxChars}
            placeholder="Schrijf hier je notitie..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-orange-500 outline-none text-gray-900 leading-relaxed resize-y"
          />
          <p className="text-xs text-gray-400 mt-2 text-right">{charCount} / {maxChars} tekens</p>
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
            Notitie Opslaan
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoteForm;
