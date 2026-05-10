
import React, { useState, useEffect, useCallback } from 'react';
import { apiService } from './apiService';
import { Recipe, Ingredient, GroceryList, Pageable } from './types';
import RecipeList from './components/RecipeList';
import RecipeForm from './components/RecipeForm';
import RecipeDetail from './components/RecipeDetail';
import IngredientManager from './components/IngredientManager';
import IngredientForm from './components/IngredientForm';
import GroceryListManager from './components/GroceryListManager';
import GroceryListForm from './components/GroceryListForm';
import GroceryListDetail from './components/GroceryListDetail';
import Header from './components/Header';
import MobileNav from './components/MobileNav';

type AppView = 'list' | 'create' | 'edit' | 'detail' | 'ingredients' | 'ingredient_create' | 'ingredient_edit' | 'grocery_lists' | 'grocery_create' | 'grocery_edit' | 'grocery_detail';

const App: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<AppView>('list');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [selectedGroceryList, setSelectedGroceryList] = useState<GroceryList | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({ page: 0, totalPages: 0 });
  const [isMockMode, setIsMockMode] = useState(false);

  const fetchRecipes = useCallback(async (search: string = '', page: number = 0) => {
    setLoading(true);
    setError(null);
    try {
      const pageable: Pageable = { page, size: 12 };
      const response = search 
        ? await apiService.searchRecipes(search, pageable)
        : await apiService.getRecipes(pageable);
      
      setRecipes(response.data);
      setPagination({ page: response.currentPage, totalPages: response.totalPages });
      setIsMockMode(apiService.isMocked);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Laden van recepten mislukt');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (view === 'list' || view === 'detail') {
      fetchRecipes(searchTerm, pagination.page);
    }
  }, [searchTerm, pagination.page, fetchRecipes, view]);

  const handleCreate = () => {
    if (view === 'ingredients' || view.startsWith('ingredient')) {
      setSelectedIngredient(null);
      setView('ingredient_create');
    } else if (view === 'grocery_lists' || view.startsWith('grocery')) {
      setSelectedGroceryList(null);
      setView('grocery_create');
    } else {
      setSelectedRecipe(null);
      setView('create');
    }
  };

  const handleEdit = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setView('edit');
  };

  const handleViewDetail = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setView('detail');
  };

  const handleSave = async (recipeData: Partial<Recipe>) => {
    try {
      if ((view === 'edit' || selectedRecipe) && selectedRecipe?.id) {
        await apiService.updateRecipe(selectedRecipe.id, recipeData);
      } else {
        await apiService.createRecipe(recipeData);
      }
      setView('list');
      fetchRecipes(searchTerm, pagination.page);
    } catch (err) {
      alert('Fout bij opslaan recept');
    }
  };

  const handleSaveIngredient = async (ingData: Partial<Ingredient>) => {
    try {
      if (selectedIngredient?.id) {
        await apiService.updateIngredient(selectedIngredient.id, ingData);
      } else {
        await apiService.createIngredient(ingData);
      }
      setView('ingredients');
    } catch (err) {
      alert('Fout bij opslaan ingrediënt');
    }
  };

  const handleSaveGroceryList = async (listData: Partial<GroceryList>) => {
    try {
      if (selectedGroceryList?.id) {
        await apiService.updateGroceryList(selectedGroceryList.id, listData);
      } else {
        await apiService.createGroceryList(listData);
      }
      setView('grocery_lists');
    } catch (err) {
      alert('Fout bij opslaan boodschappenlijst');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Weet je zeker dat je dit recept wilt verwijderen?')) return;
    try {
      await apiService.deleteRecipe(id);
      setRecipes(prev => prev.filter(r => r.id !== id));
      fetchRecipes(searchTerm, pagination.page);
    } catch (err) {
      alert('Fout bij verwijderen recept');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        onSearch={(val) => {
          setSearchTerm(val);
          setPagination(prev => ({ ...prev, page: 0 }));
        }} 
        onCreate={handleCreate}
        onHome={() => setView('list')}
        onIngredients={() => setView('ingredients')}
        onGroceryLists={() => setView('grocery_lists')}
        isMockMode={isMockMode}
        currentView={view}
      />

      <main className="flex-grow container mx-auto px-4 py-8 pb-24 md:pb-8">
        {isMockMode && (
          <div className="mb-6 bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-xl shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-amber-700 font-medium">Demo Modus Geactiveerd</p>
                <p className="text-xs text-amber-600 mt-1">Verbinding met backend mislukt, gegevens worden lokaal opgeslagen.</p>
              </div>
            </div>
          </div>
        )}

        {loading && recipes.length === 0 && view === 'list' ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <>
            {view === 'list' && (
              <RecipeList 
                recipes={recipes} 
                onEdit={handleEdit} 
                onView={handleViewDetail}
                onDelete={handleDelete}
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={(p) => setPagination(prev => ({ ...prev, page: p }))}
              />
            )}
            {(view === 'create' || view === 'edit') && (
              <RecipeForm 
                recipe={selectedRecipe || undefined} 
                onSave={handleSave} 
                onCancel={() => setView('list')} 
              />
            )}
            {view === 'detail' && selectedRecipe && (
              <RecipeDetail 
                recipe={selectedRecipe} 
                onEdit={() => setView('edit')}
                onBack={() => setView('list')}
              />
            )}
            {view === 'ingredients' && (
              <IngredientManager 
                isMockMode={isMockMode} 
                onEditIngredient={(ing) => {
                  setSelectedIngredient(ing);
                  setView('ingredient_edit');
                }}
                onCreateIngredient={handleCreate}
                onReload={() => setView('ingredients')}
              />
            )}
            {(view === 'ingredient_create' || view === 'ingredient_edit') && (
              <IngredientForm 
                ingredient={selectedIngredient || undefined}
                onSave={handleSaveIngredient}
                onCancel={() => setView('ingredients')}
              />
            )}
            {view === 'grocery_lists' && (
              <GroceryListManager 
                onEditList={(list) => {
                  setSelectedGroceryList(list);
                  setView('grocery_edit');
                }}
                onCreateList={handleCreate}
                onViewList={(list) => {
                  setSelectedGroceryList(list);
                  setView('grocery_detail');
                }}
              />
            )}
            {(view === 'grocery_create' || view === 'grocery_edit') && (
              <GroceryListForm 
                list={selectedGroceryList || undefined}
                onSave={handleSaveGroceryList}
                onCancel={() => setView('grocery_lists')}
              />
            )}
            {view === 'grocery_detail' && selectedGroceryList && (
              <GroceryListDetail 
                list={selectedGroceryList}
                onBack={() => setView('grocery_lists')}
              />
            )}
          </>
        )}
      </main>

      <footer className="hidden md:block bg-white border-t border-gray-200 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} PegEnLex. Gebouwd met React & Tailwind.
        </div>
      </footer>

      <MobileNav 
        currentView={view}
        onHome={() => setView('list')}
        onIngredients={() => setView('ingredients')}
        onGroceryLists={() => setView('grocery_lists')}
      />
    </div>
  );
};

export default App;
