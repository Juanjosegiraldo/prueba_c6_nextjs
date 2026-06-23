import type { Recipe } from "@/services/recipeService";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

interface ApiResponse<T> {
  data: T;
  code: number;
  message: string;
}

// Returns the recipes the user has favorited.
export async function getFavorites(userId: string): Promise<Recipe[]> {
  const res = await fetch(`${BASE_URL}/api/favorites?userId=${userId}`, {
    cache: "no-store",
  });
  const json: ApiResponse<Recipe[]> = await res.json();
  return json.data ?? [];
}

// Toggles a favorite (adds it if missing, removes it if present).
export async function toggleFavorite(
  userId: string,
  recipeId: string
): Promise<{ favorited: boolean }> {
  const res = await fetch(`${BASE_URL}/api/favorites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, recipeId }),
  });
  const json: ApiResponse<{ favorited: boolean } | null> = await res.json();
  return json.data ?? { favorited: false };
}
