import React from 'react';
import { Note } from '../types';

interface NoteDetailProps {
  note: Note;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const NoteDetail: React.FC<NoteDetailProps> = ({ note, onBack, onEdit, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm('Weet je zeker dat je deze notitie wilt verwijderen?')) {
      onDelete();
    }
  };

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
          <div className="flex justify-between items-start gap-4">
            <div>
              <h2 className="text-3xl font-black">{note.title}</h2>
              <div className="flex items-center gap-3 mt-2 opacity-80 text-sm">
                <span>Gemaakt: {note.createdAt ? new Date(note.createdAt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Onbekend'}</span>
                {note.updatedAt && note.updatedAt !== note.createdAt && (
                  <span>Bewerkt: {new Date(note.updatedAt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                )}
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={onEdit}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
                Bewerken
              </button>
              <button
                onClick={handleDelete}
                className="bg-white/20 hover:bg-red-500/40 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
                Verwijderen
              </button>
            </div>
          </div>
        </div>

        <div className="p-8">
          {note.content ? (
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
              {note.content}
            </div>
          ) : (
            <p className="text-gray-400 italic">Geen inhoud.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteDetail;
