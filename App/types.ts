
export type RecipeUnit = 'l' | 'ml' | 'gr' | 'kg' | 'stuk' | 'tl' | 'el';

export const VALID_UNITS: RecipeUnit[] = ['l', 'ml', 'gr', 'kg', 'stuk', 'tl', 'el'];

export interface Ingredient {
  id: string;
  name: string;
  category: string;
  unit: RecipeUnit;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  tag: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
}

export interface RecipeIngredient {
  id?: string;
  ingredient: Ingredient;
  quantity: number;
  unit: RecipeUnit;
  notes?: string;
}

export interface Recipe {
  id?: string;
  user?: User;
  title: string;
  description: string;
  instructions: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficultyLevel: 'Easy' | 'Medium' | 'Hard';
  cuisineType: string;
  tags: Tag[];
  imageUrl: string;
  recipeIngredients: RecipeIngredient[];
  public: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface GroceryList {
  id?: string;
  user?: User;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  active: boolean;
}

export interface GroceryListItem {
  id: string;
  groceryListId: string;
  ingredient: Ingredient;
  quantity: number;
  unit: string;
  completed: boolean;
  priority: number;
}

export interface Note {
  id?: string;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Pageable {
  page: number;
  size: number;
  sort?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
