import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Recipe, Ingredient, Tag, RecipeIngredient, RecipeUnit, VALID_UNITS } from '../types';
import { apiService } from '../apiService';

interface RecipeFormProps {
  recipe?: Recipe;
  onSave: (recipe: Partial<Recipe>) => void;
  onCancel: () => void;
}

const RecipeForm: React.FC<RecipeFormProps> = ({ recipe, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Recipe>>(
    recipe || {
      title: '',
      description: '',
      instructions: '',
      prepTimeMinutes: 0,
      cookTimeMinutes: 0,
      servings: 1,
      difficultyLevel: 'Medium',
      cuisineType: '',
      tags: [],
      imageUrl: '',
      recipeIngredients: [],
      public: true,
    }
  );

  const [availableIngredients, setAvailableIngredients] = useState<Ingredient[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [ingSearch, setIngSearch] = useState('');
  const [loadingIngredients, setLoadingIngredients] = useState(false); // New loading state for ingredients
  const [tagSearch, setTagSearch] = useState('');
  const [cuisineSuggestions, setCuisineSuggestions] = useState<string[]>([]);
  const [showCuisineSuggestions, setShowCuisineSuggestions] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const cuisineRef = useRef<HTMLDivElement>(null);

  // Effect for fetching available ingredients with debounce
  useEffect(() => {
    const fetchIngredients = async () => {
      setLoadingIngredients(true);
      try {
        // Now passing ingSearch to the API service
        const res = await apiService.getIngredients({ page: 0, size: 50 }, ingSearch);
        setAvailableIngredients(res.data);
      } catch (error) {
        console.error("Failed to fetch ingredients:", error);
      } finally {
        setLoadingIngredients(false);
      }
    };

    const handler = setTimeout(() => {
      fetchIngredients();
    }, 300); // Debounce API call by 300ms

    return () => {
      clearTimeout(handler); // Cleanup timeout on unmount or re-render
    };
  }, [ingSearch]); // Re-run effect when ingSearch changes

  // Effect for initial tag load (does not need debounce as it's static filtering for now)
  useEffect(() => {
    apiService.getTags({ page: 0, size: 50 }).then(res => setAvailableTags(res.data));
  }, []);

  // Effect for cuisine type autocomplete
  useEffect(() => {
    if (!formData.cuisineType || formData.cuisineType.length < 1) {
      setCuisineSuggestions([]);
      return;
    }

    const fetchCuisineSuggestions = async () => {
      try {
        const suggestions = await apiService.getCuisineAutocomplete(formData.cuisineType!);
        setCuisineSuggestions(suggestions);
      } catch (error) {
        console.error("Failed to fetch cuisine suggestions:", error);
      }
    };

    const handler = setTimeout(() => {
      fetchCuisineSuggestions();
    }, 300);

    return () => clearTimeout(handler);
  }, [formData.cuisineType]);

  // Click outside listener for cuisine suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cuisineRef.current && !cuisineRef.current.contains(event.target as Node)) {
        setShowCuisineSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleAddIngredient = (ingredient: Ingredient) => {
    const exists = formData.recipeIngredients?.find(ri => ri.ingredient.id === ingredient.id);
    if (exists) return;

    setFormData(prev => ({
      ...prev,
      recipeIngredients: [
        ...(prev.recipeIngredients || []),
        { ingredient, quantity: 1, unit: ingredient.unit }
      ]
    }));
  };

  const handleRemoveIngredient = (id: string) => {
    setFormData(prev => ({
      ...prev,
      recipeIngredients: prev.recipeIngredients?.filter(ri => ri.ingredient.id !== id)
    }));
  };

  const handleUpdateIngQty = (id: string, qty: number) => {
    setFormData(prev => ({
      ...prev,
      recipeIngredients: prev.recipeIngredients?.map(ri => 
        ri.ingredient.id === id ? { ...ri, quantity: qty } : ri
      )
    }));
  };

  const handleUpdateIngUnit = (id: string, unit: RecipeUnit) => {
    setFormData(prev => ({
      ...prev,
      recipeIngredients: prev.recipeIngredients?.map(ri => 
        ri.ingredient.id === id ? { ...ri, unit } : ri
      )
    }));
  };

  const handleToggleTag = (tag: Tag) => {
    const exists = formData.tags?.find(t => t.id === tag.id);
    if (exists) {
      setFormData(prev => ({
        ...prev,
        tags: prev.tags?.filter(t => t.id !== tag.id)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tag]
      }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await apiService.uploadImage(file);
      setFormData(prev => ({ ...prev, imageUrl: res.imageUrl }));
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      <div className="bg-orange-500 p-8 text-white">
        <h2 className="text-3xl font-bold">{recipe ? 'Edit Recipe' : 'Create New Recipe'}</h2>
        <p className="opacity-90 mt-1">Fill in the details below to share your culinary masterpiece.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Basic Info */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Recipe Title</label>
              <input
                required
                name="title"
                value={formData.title || ''}
                onChange={handleChange}
                placeholder="e.g. Grandma's Special Pasta"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-orange-500 transition-all outline-none text-gray-900 font-medium placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                required
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                rows={3}
                placeholder="A short story or summary of the dish..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-orange-500 transition-all outline-none text-gray-900 placeholder-gray-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Prep Time (min)</label>
                <input
                  type="number"
                  name="prepTimeMinutes"
                  value={formData.prepTimeMinutes || 0}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-orange-500 outline-none text-gray-900 font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cook Time (min)</label>
                <input
                  type="number"
                  name="cookTimeMinutes"
                  value={formData.cookTimeMinutes || 0}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-orange-500 outline-none text-gray-900 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Servings</label>
                <input
                  type="number"
                  name="servings"
                  value={formData.servings || 1}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-orange-500 outline-none text-gray-900 font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty</label>
                <select
                  name="difficultyLevel"
                  value={formData.difficultyLevel || 'Medium'}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-orange-500 outline-none text-gray-900 font-medium"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            <div className="relative" ref={cuisineRef}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Cuisine Type</label>
              <input
                name="cuisineType"
                value={formData.cuisineType || ''}
                onChange={(e) => {
                  handleChange(e);
                  setShowCuisineSuggestions(true);
                }}
                onFocus={() => setShowCuisineSuggestions(true)}
                placeholder="e.g. Italian, Thai, Fusion"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-orange-500 outline-none text-gray-900 font-medium placeholder-gray-400"
                autoComplete="off"
              />
              {showCuisineSuggestions && cuisineSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                  {cuisineSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-orange-50 cursor-pointer text-gray-700 font-medium transition-colors"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, cuisineType: suggestion }));
                        setShowCuisineSuggestions(false);
                      }}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Recipe Image</label>
              <div className="space-y-4">
                {formData.imageUrl && (
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-inner group">
                    <img 
                      src={formData.imageUrl} 
                      alt="Recipe Preview" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                        className="bg-white/90 text-red-600 p-2 rounded-full shadow-lg hover:bg-red-50 transition-colors"
                        title="Remove image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 gap-3">
                  <div className="w-full">
                    <label className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                      uploadingImage ? 'border-orange-200 bg-orange-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'
                    }`}>
                      <div className="flex flex-col items-center justify-center py-4">
                        {uploadingImage ? (
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                        ) : (
                          <div className="flex items-center gap-2 text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm font-semibold text-gray-600">Upload Image</span>
                          </div>
                        )}
                        {!uploadingImage && <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-bold">JPG, PNG, GIF</p>}
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                      />
                    </label>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400 text-[10px] font-black uppercase bg-gray-100 px-1.5 py-0.5 rounded leading-none">URL</span>
                    </div>
                    <input
                      name="imageUrl"
                      value={formData.imageUrl || ''}
                      onChange={handleChange}
                      placeholder="...or paste an image link here"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 pl-14 focus:ring-2 focus:ring-orange-500 outline-none text-gray-900 text-sm placeholder-gray-400 transition-all shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions & Ingredients */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Instructions</label>
              <textarea
                required
                name="instructions"
                value={formData.instructions || ''}
                onChange={handleChange}
                rows={8}
                placeholder="Step 1: Chop the onions...&#10;Step 2: Sauté in olive oil..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-orange-500 transition-all outline-none text-gray-900 placeholder-gray-400 leading-relaxed"
              />
            </div>

            {/* Tags Integration */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags?.map(t => (
                  <span key={t.id} className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    {t.tag}
                    <button type="button" onClick={() => handleToggleTag(t)} className="hover:text-orange-900 font-bold" aria-label={`Remove tag ${t.tag}`}>&times;</button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Filter tags..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-4 text-sm mb-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 outline-none"
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
                aria-label="Filter available tags"
              />
              <div className="max-h-32 overflow-y-auto border border-gray-100 rounded-xl p-2 flex flex-wrap gap-2">
                {availableTags
                  .filter(t => t.tag.toLowerCase().includes(tagSearch.toLowerCase()))
                  .map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleToggleTag(t)}
                      className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                        formData.tags?.find(st => st.id === t.id)
                        ? 'bg-orange-500 text-white border-orange-500 font-bold'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'
                      }`}
                      aria-pressed={!!formData.tags?.find(st => st.id === t.id)}
                      aria-label={`Toggle tag ${t.tag}`}
                    >
                      {t.tag}
                    </button>
                  ))
                }
              </div>
            </div>
          </div>
        </div>

        {/* Ingredients Integration */}
        <div className="pt-6 border-t border-gray-100">
          <label className="block text-lg font-bold text-gray-900 mb-4">Ingredients</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search to add ingredients..."
                  className="w-full bg-gray-100 border-none rounded-xl py-3 px-4 pl-10 focus:ring-2 focus:ring-orange-500 outline-none text-gray-900 placeholder-gray-400"
                  value={ingSearch}
                  onChange={(e) => setIngSearch(e.target.value)}
                  aria-label="Search ingredients to add"
                />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
                {loadingIngredients ? (
                  <div className="flex justify-center items-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                  </div>
                ) : availableIngredients.length === 0 ? (
                  <div className="text-gray-400 italic text-center py-4">No ingredients found.</div>
                ) : (
                  availableIngredients
                  .map(i => (
                    <div 
                      key={i.id} 
                      className="flex items-center justify-between p-3 bg-gray-50 hover:bg-orange-50 rounded-xl cursor-pointer transition-colors group"
                      onClick={() => handleAddIngredient(i)}
                      role="button"
                      tabIndex={0}
                      aria-label={`Add ${i.name} to recipe`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleAddIngredient(i);
                        }
                      }}
                    >
                      <div>
                        <div className="font-semibold text-sm text-gray-800">{i.name}</div>
                        <div className="text-xs text-gray-500">{i.category}</div>
                      </div>
                      <div className="text-orange-500 opacity-0 group-hover:opacity-100 font-bold text-lg">+</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Added to Recipe</h4>
              {formData.recipeIngredients?.length === 0 ? (
                <div className="text-gray-400 italic text-center py-8 border-2 border-dashed border-gray-100 rounded-2xl">
                  No ingredients added yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.recipeIngredients?.map(ri => (
                    <div key={ri.ingredient.id} className="flex items-center gap-4 p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                      <div className="flex-grow">
                        <div className="font-semibold text-gray-900">{ri.ingredient.name}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={ri.quantity || 0}
                          onChange={(e) => handleUpdateIngQty(ri.ingredient.id!, parseFloat(e.target.value) || 0)}
                          className="w-16 bg-gray-50 border border-gray-200 rounded-lg py-1 px-2 text-center text-sm text-gray-900 font-bold"
                          aria-label={`Quantity for ${ri.ingredient.name}`}
                        />
                        <select
                          value={ri.unit || 'gr'}
                          onChange={(e) => handleUpdateIngUnit(ri.ingredient.id!, e.target.value as RecipeUnit)}
                          className="text-sm text-gray-500 bg-gray-50 border-none rounded-lg py-1 px-1 outline-none"
                          aria-label={`Unit for ${ri.ingredient.name}`}
                        >
                          {VALID_UNITS.map(u => (
                            <option key={u} value={u}>{u}</option>
                          ))}
                        </select>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveIngredient(ri.ingredient.id!)}
                        className="text-red-400 hover:text-red-600 p-1 transition-colors"
                        aria-label={`Remove ${ri.ingredient.name} from recipe`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-8 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-10 py-3 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600 shadow-lg shadow-orange-200 transition-all hover:-translate-y-0.5"
          >
            {recipe ? 'Update Recipe' : 'Save Recipe'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecipeForm;