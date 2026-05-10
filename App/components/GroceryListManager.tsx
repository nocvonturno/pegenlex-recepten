
import React, { useState, useEffect } from 'react';
import { GroceryList } from '../types';
import { apiService } from '../apiService';

interface GroceryListManagerProps {
  onEditList: (list: GroceryList) => void;
  onCreateList: () => void;
  onViewList: (list: GroceryList) => void;
}

const GroceryListManager: React.FC<GroceryListManagerProps> = ({ 
  onEditList, 
  onCreateList,
  onViewList
}) => {
  const [lists, setLists] = useState<GroceryList[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLists = async (currentSearch: string) => {
    setLoading(true);
    try {
      const response = currentSearch 
        ? await apiService.searchGroceryLists(currentSearch, { page: 0, size: 50 })
        : await apiService.getGroceryLists({ page: 0, size: 50 });
      setLists(response.data);
    } catch (err) {
      console.error("Failed to fetch grocery lists:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchLists(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm('Verwijderen?')) return;
    try {
      await apiService.deleteGroceryList(id);
      fetchLists(searchTerm);
    } catch (err) {
      alert('Fout bij verwijderen.');
    }
  };

  const handleEdit = (e: React.MouseEvent, list: GroceryList) => {
    e.stopPropagation();
    onEditList(list);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Boodschappenlijsten</h2>
          <p className="text-gray-500 text-sm">Organiseer je aankopen voor geplande recepten.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Zoek lijsten..." 
              className="bg-white border border-gray-200 rounded-xl py-2 px-4 pl-10 focus:ring-2 focus:ring-orange-500 outline-none text-sm text-gray-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <button 
            onClick={onCreateList}
            className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-orange-600 transition-colors"
          >
            Nieuwe Lijst
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-gray-400 italic">Laden...</div>
        ) : lists.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-400 italic">Geen lijsten gevonden.</div>
        ) : (
          lists.map(list => (
            <div 
              key={list.id} 
              onClick={() => onViewList(list)}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all relative overflow-hidden group cursor-pointer"
            >
              <div className={`absolute top-0 left-0 w-1 h-full ${list.active ? 'bg-green-500' : 'bg-gray-200'}`}></div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg group-hover:text-orange-600 transition-colors">{list.name}</h3>
                  <p className="text-xs text-gray-400 mt-1">{list.createdAt ? new Date(list.createdAt).toLocaleDateString('nl-NL') : 'Datum onbekend'}</p>
                </div>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${list.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {list.active ? 'Actief' : 'Afgerond'}
                </span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mb-6 min-h-[40px]">{list.description || 'Geen omschrijving'}</p>
              
              <div className="flex justify-end gap-2 border-t pt-4">
                <button 
                  onClick={(e) => handleEdit(e, list)}
                  className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                  title="Bewerken"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                </button>
                <button 
                  onClick={(e) => list.id && handleDelete(e, list.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Verwijderen"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GroceryListManager;
