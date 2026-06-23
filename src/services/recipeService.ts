import type { IRecipe } from "@/database/models/Recipe";

// Unified API envelope used across the app.
interface ApiResponse<T> {
  data: T;
  code: number;
  message: string;
}

// Paginated listing envelope returned by GET /api/recipes.
interface PaginatedResponse<T> extends ApiResponse<T> {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

// What the catalog page consumes: one page of recipes plus paging metadata.
export interface RecipePage {
  recipes: Recipe[];
  total: number;
  hasMore: boolean;
}

// What the API returns: the domain fields plus the serialized id.
export type Recipe = IRecipe & { _id: string };

// Fields the client may send when creating/updating a recipe.
export type RecipeInput = {
  name: string;
  prepTime: number;
  difficulty?: "easy" | "medium" | "hard";
  ingredients?: string[];
  steps?: string[];
  servings?: number;
  image?: string;
};

// Fetch a single page of recipes (default 12 per page) instead of the whole DB.
export async function getRecipes(page = 1, limit = 12): Promise<RecipePage> {
  const res = await fetch(
    `/api/recipes?page=${page}&limit=${limit}`,
    { cache: "no-store" }
  );
  const json: PaginatedResponse<Recipe[]> = await res.json();
  return { recipes: json.data, total: json.total, hasMore: json.hasMore };
}

export async function getRecipeById(id: string): Promise<Recipe | null> {
  const res = await fetch(`/api/recipes/${id}`, { cache: "no-store" });
  if (res.status === 404) return null;
  const json: ApiResponse<Recipe> = await res.json();
  return json.data;
}

export async function createRecipe(input: RecipeInput): Promise<Recipe> {
  const res = await fetch(`/api/recipes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const json: ApiResponse<Recipe> = await res.json();
  return json.data;
}

export async function updateRecipe(
  id: string,
  input: Partial<RecipeInput>
): Promise<Recipe | null> {
  const res = await fetch(`/api/recipes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (res.status === 404) return null;
  const json: ApiResponse<Recipe> = await res.json();
  return json.data;
}

export async function deleteRecipe(id: string): Promise<boolean> {
  const res = await fetch(`/api/recipes/${id}`, { method: "DELETE" });
  return res.ok;
}
