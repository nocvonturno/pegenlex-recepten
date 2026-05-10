
import { 
  Recipe, 
  Ingredient, 
  Tag, 
  GroceryList,
  GroceryListItem,
  PaginatedResponse, 
  Pageable 
} from './types';

const BASE_URL = 'http://192.168.11.135:8090';

// --- MUTABLE MOCK DATA FOR SESSION ---
let session_ingredients: Ingredient[] = [
  { id: '1', name: 'San Marzano Tomaten', category: 'Groenten', unit: 'gr', description: 'Zoete Italiaanse tomaten', createdAt: '', updatedAt: '' },
  { id: '2', name: 'Verse Basilicum', category: 'Kruiden', unit: 'stuk', description: 'Aromatische groene blaadjes', createdAt: '', updatedAt: '' },
  { id: '3', name: 'Extra Vierge Olijfolie', category: 'Olie', unit: 'ml', description: 'Koud geperste olie', createdAt: '', updatedAt: '' },
  { id: '4', name: 'Spaghetti', category: 'Pasta', unit: 'gr', description: 'Harde tarwe pasta', createdAt: '', updatedAt: '' },
  { id: '5', name: 'Knoflook', category: 'Groenten', unit: 'stuk', description: 'Scherpe aromatische bol', createdAt: '', updatedAt: '' },
];

let session_tags: Tag[] = [
  { id: '1', tag: 'Italiaans', createdAt: '', updatedAt: '' },
  { id: '2', tag: 'Snel', createdAt: '', updatedAt: '' },
  { id: '3', tag: 'Vegetarisch', createdAt: '', updatedAt: '' },
];

let session_recipes: Recipe[] = [
  {
    id: '1',
    title: 'Klassieke Spaghetti Pomodoro',
    description: 'Een tijdloze Italiaanse favoriet met verse basilicum en tomaten.',
    instructions: '1. Kook water met zout.\n2. Fruit de knoflook in olijfolie.\n3. Voeg de gepelde tomaten toe.\n4. Kook de pasta al dente.\n5. Meng alles en serveer met verse basilicum.',
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    servings: 2,
    difficultyLevel: 'Easy',
    cuisineType: 'Italiaans',
    tags: [session_tags[0], session_tags[1]],
    imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=800',
    recipeIngredients: [
      { ingredient: session_ingredients[0], quantity: 400, unit: 'gr' },
      { ingredient: session_ingredients[1], quantity: 10, unit: 'stuk' },
    ],
    public: true
  }
];

let session_grocery_lists: GroceryList[] = [
  { id: 'gl1', name: 'Wekelijkse Boodschappen', description: 'Benodigdheden voor de hele week inclusief pasta ingrediënten.', active: true, createdAt: new Date().toISOString() },
  { id: 'gl2', name: 'Feestje Zaterdag', description: 'Drankjes en hapjes voor het diner.', active: false, createdAt: new Date().toISOString() }
];

let session_grocery_items: GroceryListItem[] = [
  { id: 'gi1', groceryListId: 'gl1', ingredient: session_ingredients[3], quantity: 1, unit: 'kg', completed: false, priority: 0 },
  { id: 'gi2', groceryListId: 'gl1', ingredient: session_ingredients[0], quantity: 3, unit: 'blik', completed: true, priority: 1 },
  { id: 'gi3', groceryListId: 'gl1', ingredient: session_ingredients[2], quantity: 500, unit: 'ml', completed: false, priority: 2 },
];

const createPaginatedMock = <T>(data: T[]): PaginatedResponse<T> => ({
  data,
  currentPage: 0,
  totalPages: Math.ceil(data.length / 12) || 1,
  totalItems: data.length,
  pageSize: 12,
  hasNext: false,
  hasPrevious: false
});

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    let errorData: any = {};
    try { errorData = JSON.parse(text); } catch(e) {}
    throw new Error(errorData.message || `API Fout: ${response.status}`);
  }
  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

export const apiService = {
  isMocked: false,

  // --- RECIPES ---
  getRecipes: async (pageable: Pageable): Promise<PaginatedResponse<Recipe>> => {
    try {
      const params = new URLSearchParams({ page: pageable.page.toString(), size: pageable.size.toString() });
      const response = await fetch(`${BASE_URL}/recipes?${params}`);
      const data = await handleResponse(response);
      apiService.isMocked = false;
      return data;
    } catch (e) {
      apiService.isMocked = true;
      return createPaginatedMock(session_recipes);
    }
  },

  searchRecipes: async (searchText: string, pageable: Pageable): Promise<PaginatedResponse<Recipe>> => {
    try {
      const params = new URLSearchParams({ searchText, page: pageable.page.toString(), size: pageable.size.toString() });
      const response = await fetch(`${BASE_URL}/recipes/search?${params}`);
      const data = await handleResponse(response);
      apiService.isMocked = false;
      return data;
    } catch (e) {
      apiService.isMocked = true;
      const filtered = session_recipes.filter(r => 
        r.title.toLowerCase().includes(searchText.toLowerCase()) || 
        r.cuisineType.toLowerCase().includes(searchText.toLowerCase())
      );
      return createPaginatedMock(filtered);
    }
  },

  createRecipe: async (recipe: Partial<Recipe>): Promise<Recipe> => {
    try {
      const response = await fetch(`${BASE_URL}/recipes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipe),
      });
      return await handleResponse(response);
    } catch (e) {
      apiService.isMocked = true;
      const newRecipe = { 
        ...recipe, 
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as Recipe;
      session_recipes = [newRecipe, ...session_recipes];
      return newRecipe;
    }
  },

  updateRecipe: async (id: string, recipe: Partial<Recipe>): Promise<Recipe> => {
    try {
      const response = await fetch(`${BASE_URL}/recipes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipe),
      });
      return await handleResponse(response);
    } catch (e) {
      apiService.isMocked = true;
      session_recipes = session_recipes.map(r => r.id === id ? { ...r, ...recipe, updatedAt: new Date().toISOString() } : r);
      return session_recipes.find(r => r.id === id)!;
    }
  },

  deleteRecipe: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${BASE_URL}/recipes/${id}`, {
        method: 'DELETE',
      });
      await handleResponse(response);
    } catch (e) {
      apiService.isMocked = true;
      session_recipes = session_recipes.filter(r => r.id !== id);
    }
  },

  // --- INGREDIENTS ---
  getIngredients: async (pageable: Pageable, searchText: string = ''): Promise<PaginatedResponse<Ingredient>> => {
    try {
      const params = new URLSearchParams({ page: pageable.page.toString(), size: pageable.size.toString() });
      let url = `${BASE_URL}/ingredients`;
      if (searchText) {
        params.append('searchText', searchText);
        url = `${BASE_URL}/ingredients/search`;
      }
      const response = await fetch(`${url}?${params}`);
      const data = await handleResponse(response);
      apiService.isMocked = false;
      return data;
    } catch (e) {
      apiService.isMocked = true;
      const filtered = searchText
        ? session_ingredients.filter(ing => ing.name.toLowerCase().includes(searchText.toLowerCase()))
        : session_ingredients;
      return createPaginatedMock(filtered);
    }
  },

  createIngredient: async (ingredient: Partial<Ingredient>): Promise<Ingredient> => {
    try {
      const response = await fetch(`${BASE_URL}/ingredients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ingredient),
      });
      return await handleResponse(response);
    } catch (e) {
      apiService.isMocked = true;
      const newIng = { ...ingredient, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() } as Ingredient;
      session_ingredients = [newIng, ...session_ingredients];
      return newIng;
    }
  },

  updateIngredient: async (id: string, ingredient: Partial<Ingredient>): Promise<Ingredient> => {
    try {
      const response = await fetch(`${BASE_URL}/ingredients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ingredient),
      });
      return await handleResponse(response);
    } catch (e) {
      apiService.isMocked = true;
      session_ingredients = session_ingredients.map(i => i.id === id ? { ...i, ...ingredient } : i);
      return session_ingredients.find(i => i.id === id)!;
    }
  },

  deleteIngredient: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${BASE_URL}/ingredients/${id}`, {
        method: 'DELETE',
      });
      await handleResponse(response);
    } catch (e) {
      apiService.isMocked = true;
      session_ingredients = session_ingredients.filter(i => i.id !== id);
    }
  },

  // --- GROCERY LISTS ---
  getGroceryLists: async (pageable: Pageable): Promise<PaginatedResponse<GroceryList>> => {
    try {
      const params = new URLSearchParams({ page: pageable.page.toString(), size: pageable.size.toString() });
      const response = await fetch(`${BASE_URL}/grocerylist?${params}`);
      const data = await handleResponse(response);
      apiService.isMocked = false;
      return data;
    } catch (e) {
      apiService.isMocked = true;
      return createPaginatedMock(session_grocery_lists);
    }
  },

  searchGroceryLists: async (searchText: string, pageable: Pageable): Promise<PaginatedResponse<GroceryList>> => {
    try {
      const params = new URLSearchParams({ searchText, page: pageable.page.toString(), size: pageable.size.toString() });
      const response = await fetch(`${BASE_URL}/grocerylist/search?${params}`);
      const data = await handleResponse(response);
      apiService.isMocked = false;
      return data;
    } catch (e) {
      apiService.isMocked = true;
      const filtered = session_grocery_lists.filter(gl => 
        gl.name.toLowerCase().includes(searchText.toLowerCase()) || 
        gl.description.toLowerCase().includes(searchText.toLowerCase())
      );
      return createPaginatedMock(filtered);
    }
  },

  createGroceryList: async (list: Partial<GroceryList>): Promise<GroceryList> => {
    try {
      const response = await fetch(`${BASE_URL}/grocerylist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(list),
      });
      return await handleResponse(response);
    } catch (e) {
      apiService.isMocked = true;
      const newList = { 
        ...list, 
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString()
      } as GroceryList;
      session_grocery_lists = [newList, ...session_grocery_lists];
      return newList;
    }
  },

  updateGroceryList: async (id: string, list: Partial<GroceryList>): Promise<GroceryList> => {
    try {
      const response = await fetch(`${BASE_URL}/grocerylist/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(list),
      });
      return await handleResponse(response);
    } catch (e) {
      apiService.isMocked = true;
      session_grocery_lists = session_grocery_lists.map(gl => gl.id === id ? { ...gl, ...list } : gl);
      return session_grocery_lists.find(gl => gl.id === id)!;
    }
  },

  deleteGroceryList: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${BASE_URL}/grocerylist/${id}`, {
        method: 'DELETE',
      });
      await handleResponse(response);
    } catch (e) {
      apiService.isMocked = true;
      session_grocery_lists = session_grocery_lists.filter(gl => gl.id !== id);
      session_grocery_items = session_grocery_items.filter(gi => gi.groceryListId !== id);
    }
  },

  // --- GROCERY LIST ITEMS ---
  getGroceryListItems: async (listId: string): Promise<GroceryListItem[]> => {
    try {
      const response = await fetch(`${BASE_URL}/grocerylist/${listId}/grocerylistitems`);
      const data = await handleResponse(response);
      return Array.isArray(data) ? data : (data?.data || []);
    } catch (e) {
      apiService.isMocked = true;
      return session_grocery_items
        .filter(gi => gi.groceryListId === listId)
        .sort((a, b) => a.priority - b.priority);
    }
  },

  addGroceryListItem: async (listId: string, item: { ingredientId: string, quantity: number, unit: string }): Promise<GroceryListItem> => {
    const ingredient = session_ingredients.find(i => i.id === item.ingredientId);
    const payload = {
      ingredient: { id: item.ingredientId },
      name: ingredient?.name || 'Onbekend',
      quantity: item.quantity,
      unit: item.unit
    };

    try {
      const response = await fetch(`${BASE_URL}/grocerylist/${listId}/grocerylistitems`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return await handleResponse(response);
    } catch (e) {
      apiService.isMocked = true;
      if (!ingredient) throw new Error("Ingrediënt niet gevonden");
      
      const newItem: GroceryListItem = {
        id: Math.random().toString(36).substr(2, 9),
        groceryListId: listId,
        ingredient: ingredient,
        quantity: item.quantity,
        unit: item.unit,
        completed: false,
        priority: session_grocery_items.filter(gi => gi.groceryListId === listId).length,
      };
      session_grocery_items = [...session_grocery_items, newItem];
      return newItem;
    }
  },

  addGroceryListItemsBulk: async (listId: string, items: { ingredientId: string, name: string, quantity: number, unit: string }[]): Promise<void> => {
    const payload = {
      groceryListItems: items.map(item => ({
        ingredient: { id: item.ingredientId },
        name: item.name,
        quantity: item.quantity,
        unit: item.unit
      }))
    };

    try {
      const response = await fetch(`${BASE_URL}/grocerylist/${listId}/grocerylistitems`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      await handleResponse(response);
    } catch (e) {
      apiService.isMocked = true;
      items.forEach(item => {
        const ing = session_ingredients.find(i => i.id === item.ingredientId);
        if (ing) {
          const newItem: GroceryListItem = {
            id: Math.random().toString(36).substr(2, 9),
            groceryListId: listId,
            ingredient: ing,
            quantity: item.quantity,
            unit: item.unit,
            completed: false,
            priority: session_grocery_items.filter(gi => gi.groceryListId === listId).length,
          };
          session_grocery_items.push(newItem);
        }
      });
    }
  },

  updateGroceryListItem: async (listId: string, itemId: string, updates: Partial<GroceryListItem>): Promise<GroceryListItem> => {
    try {
      const response = await fetch(`${BASE_URL}/grocerylist/${listId}/grocerylistitem/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      return await handleResponse(response);
    } catch (e) {
      apiService.isMocked = true;
      session_grocery_items = session_grocery_items.map(gi => 
        gi.id === itemId ? { ...gi, ...updates } : gi
      );
      return session_grocery_items.find(gi => gi.id === itemId)!;
    }
  },

  deleteGroceryListItem: async (listId: string, itemId: string): Promise<void> => {
    try {
      const response = await fetch(`${BASE_URL}/grocerylist/${listId}/grocerylistitem/${itemId}`, {
        method: 'DELETE',
      });
      await handleResponse(response);
    } catch (e) {
      apiService.isMocked = true;
      session_grocery_items = session_grocery_items.filter(gi => gi.id !== itemId);
    }
  },

  reorderGroceryListItems: async (listId: string, itemIds: string[]): Promise<void> => {
    try {
      await fetch(`${BASE_URL}/grocerylist/${listId}/grocerylistitem/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemIds }),
      });
    } catch (e) {
      apiService.isMocked = true;
      itemIds.forEach((id, index) => {
        const item = session_grocery_items.find(gi => gi.id === id);
        if (item) item.priority = index;
      });
    }
  },

  // --- TAGS ---
  getTags: async (pageable: Pageable): Promise<PaginatedResponse<Tag>> => {
    try {
      const params = new URLSearchParams({ page: pageable.page.toString(), size: pageable.size.toString() });
      const response = await fetch(`${BASE_URL}/tags?${params}`);
      return await handleResponse(response);
    } catch (e) {
      return createPaginatedMock(session_tags);
    }
  }
};
