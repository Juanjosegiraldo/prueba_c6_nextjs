"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getFavorites, toggleFavorite } from "@/services/favorites";
import type { Recipe } from "@/services/recipeService";
import RecipeCard from "@/components/RecipeCard";

export default function FavoritesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait until the session is resolved before deciding access.
    if (authLoading) return;
    // Protected page: no session means no access.
    if (!user) {
      router.push("/login");
      return;
    }
    getFavorites(user._id)
      .then(setRecipes)
      .finally(() => setLoading(false));
  }, [user, authLoading, router]);

  const handleToggle = async (recipeId: string) => {
    if (!user) return;
    await toggleFavorite(user._id, recipeId);
    // Removing a favorite drops it from this list immediately.
    setRecipes((prev) => prev.filter((r) => r._id !== recipeId));
  };

  // Same grid as the catalog so both views share layout and spacing.
  const gridClass =
    "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  if (!user) return null;
  if (loading) {
    return (
      <main className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
        <h1 className="mb-6 text-2xl font-bold sm:text-3xl">Mis favoritos</h1>
        <div className={gridClass}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl">Mis favoritos</h1>
      {recipes.length === 0 ? (
        <p className="text-gray-600">Aún no tienes recetas favoritas.</p>
      ) : (
        <div className={gridClass}>
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              id={recipe._id}
              name={recipe.name}
              image={recipe.image}
              prepTime={recipe.prepTime}
              difficulty={recipe.difficulty}
              isFavorite={true}
              onToggleFavorite={handleToggle}
            />
          ))}
        </div>
      )}
    </main>
  );
}
