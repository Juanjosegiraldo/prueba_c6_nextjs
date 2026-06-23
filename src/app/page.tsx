"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getRecipes, type Recipe } from "@/services/recipeService";
import { getFavorites, toggleFavorite } from "@/services/favorites";
import RecipeCard from "@/components/RecipeCard";
import { useAuth } from "@/context/AuthContext";

const PAGE_SIZE = 12;

export default function CatalogPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Initial load: first page only (the API never returns the whole DB).
  useEffect(() => {
    getRecipes(1, PAGE_SIZE)
      .then(({ recipes, hasMore }) => {
        setRecipes(recipes);
        setHasMore(hasMore);
      })
      .finally(() => setLoading(false));
  }, []);

  // Append the next page, keeping the ones already on screen.
  const handleLoadMore = async () => {
    setLoadingMore(true);
    try {
      const next = page + 1;
      const { recipes: more, hasMore } = await getRecipes(next, PAGE_SIZE);
      setRecipes((prev) => [...prev, ...more]);
      setHasMore(hasMore);
      setPage(next);
    } finally {
      setLoadingMore(false);
    }
  };

  // Load the user's favorites so the markers reflect what is already saved.
  useEffect(() => {
    if (!user) {
      setFavorites(new Set());
      return;
    }
    getFavorites(user._id).then((favs) =>
      setFavorites(new Set(favs.map((r) => r._id)))
    );
  }, [user]);

  const handleToggleFavorite = async (id: string) => {
    // Protected action: require a session before marking favorites.
    if (!user) {
      router.push("/login");
      return;
    }
    const { favorited } = await toggleFavorite(user._id, id);
    setFavorites((prev) => {
      const next = new Set(prev);
      if (favorited) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  // Grid columns adapt to the viewport: 1 on phones up to 4 on large screens.
  const gridClass =
    "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  return (
    <main className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl">RecetasApp</h1>

      {loading ? (
        // Skeleton placeholders while the first page loads.
        <div className={gridClass}>
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-xl bg-gray-200"
            />
          ))}
        </div>
      ) : recipes.length === 0 ? (
        <p className="text-gray-600">No hay recetas todavía.</p>
      ) : (
        <>
          <div className={gridClass}>
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe._id}
                id={recipe._id}
                name={recipe.name}
                image={recipe.image}
                prepTime={recipe.prepTime}
                difficulty={recipe.difficulty}
                isFavorite={favorites.has(recipe._id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>

          {/* Pagination control: load the next page on demand. */}
          {hasMore && (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="rounded-lg bg-orange-600 px-6 py-2.5 font-medium text-white transition hover:bg-orange-700 disabled:opacity-60"
              >
                {loadingMore ? "Cargando..." : "Cargar más recetas"}
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
