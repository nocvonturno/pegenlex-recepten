
import React, { useState } from 'react';
import { Recipe, RecipeIngredient } from '../types';
import AddToGroceryListModal from './AddToGroceryListModal';

interface RecipeDetailProps {
  recipe: Recipe;
  onEdit: () => void;
  onBack: () => void;
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe, onEdit, onBack }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedForList, setSelectedForList] = useState<RecipeIngredient[] | null>(null);
  
  const defaultImage = `https://picsum.photos/seed/${recipe.id}/800/400`;

  const handleAddSingleToList = (ri: RecipeIngredient) => {
    setSelectedForList([ri]);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-orange-600 transition-colors font-medium"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back to Gallery
      </button>

      <div className="bg-white rounded-[2rem] overflow-hidden shadow-2xl shadow-orange-100/50 border border-gray-100">
        <div className="relative h-96">
          <img 
            src={recipe.imageUrl || defaultImage} 
            alt={recipe.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <div className="flex gap-2 mb-3">
              <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {recipe.cuisineType}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                recipe.difficultyLevel === 'Easy' ? 'bg-green-500' :
                recipe.difficultyLevel === 'Medium' ? 'bg-yellow-500' :
                'bg-red-500'
              }`}>
                {recipe.difficultyLevel}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-2">{recipe.title}</h1>
            <p className="text-lg text-white/90 max-w-2xl font-light italic">{recipe.description}</p>
          </div>
          <button 
            onClick={onEdit}
            className="absolute top-8 right-8 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white p-3 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border-b border-gray-100">
          <div className="p-8 text-center border-b lg:border-b-0 lg:border-r border-gray-100 group hover:bg-orange-50/30 transition-colors">
            <div className="text-gray-400 text-xs uppercase font-bold tracking-widest mb-1">Prep Time</div>
            <div className="text-2xl font-black text-gray-900">{recipe.prepTimeMinutes} <span className="text-sm font-normal text-gray-500">mins</span></div>
          </div>
          <div className="p-8 text-center border-b lg:border-b-0 lg:border-r border-gray-100 group hover:bg-orange-50/30 transition-colors">
            <div className="text-gray-400 text-xs uppercase font-bold tracking-widest mb-1">Cook Time</div>
            <div className="text-2xl font-black text-gray-900">{recipe.cookTimeMinutes} <span className="text-sm font-normal text-gray-500">mins</span></div>
          </div>
          <div className="p-8 text-center group hover:bg-orange-50/30 transition-colors">
            <div className="text-gray-400 text-xs uppercase font-bold tracking-widest mb-1">Servings</div>
            <div className="text-2xl font-black text-gray-900">{recipe.servings} <span className="text-sm font-normal text-gray-500">People</span></div>
          </div>
        </div>

        <div className="p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column: Ingredients */}
            <div className="lg:col-span-1">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  </span>
                  Ingredients
                </h2>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-xl shadow-lg transition-transform hover:scale-110 active:scale-95 group relative"
                  title="Alle ingrediënten toevoegen aan lijst"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                  </svg>
                </button>
              </div>

              <ul className="space-y-4">
                {recipe.recipeIngredients?.map((ri, idx) => (
                  <li key={ri.id || idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                    <div className="flex items-start gap-4">
                      <div className="font-black text-orange-500 min-w-[3rem]">
                        {ri.quantity} <span className="text-[10px] font-bold uppercase block">{ri.unit}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{ri.ingredient.name}</div>
                        {ri.notes && <div className="text-xs text-gray-500 italic">{ri.notes}</div>}
                      </div>
                    </div>
                    <button 
                      onClick={() => handleAddSingleToList(ri)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-orange-500 hover:bg-orange-100 rounded-lg transition-all"
                      title="Toevoegen aan lijst"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {recipe.tags?.map(t => (
                    <span key={t.id} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">
                      #{t.tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Instructions */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" />
                  </svg>
                </span>
                Instructions
              </h2>
              <div className="prose prose-orange max-w-none">
                {recipe.instructions.split('\n').map((step, idx) => step.trim() && (
                  <div key={idx} className="mb-8 flex gap-6 group">
                    <div className="flex-shrink-0 w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-black shadow-lg shadow-orange-200 group-hover:scale-110 transition-transform">
                      {idx + 1}
                    </div>
                    <div className="text-gray-700 leading-relaxed pt-2">
                      {step}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddToGroceryListModal 
          ingredients={recipe.recipeIngredients || []} 
          onClose={() => setShowAddModal(false)}
        />
      )}

      {selectedForList && (
        <AddToGroceryListModal 
          ingredients={selectedForList}
          onClose={() => setSelectedForList(null)}
        />
      )}
    </div>
  );
};

export default RecipeDetail;
