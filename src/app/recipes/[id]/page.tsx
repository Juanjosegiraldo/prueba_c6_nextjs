"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { getRecipeById, type Recipe } from "@/services/recipeService";
import { getFavorites, toggleFavorite } from "@/services/favorites";
import { useAuth } from "@/context/AuthContext";

const difficultyLabel: Record<Recipe["difficulty"], string> = {
  easy: "Fácil",
  medium: "Media",
  hard: "Difícil",
};

// Badge colour per difficulty for a quick visual cue.
const difficultyStyle: Record<Recipe["difficulty"], string> = {
  easy: "bg-green-100 text-green-700",
  medium: "bg-amber-100 text-amber-700",
  hard: "bg-red-100 text-red-700",
};

export default function RecipeDetailPage() {
  // On the client, useParams() returns the already-resolved params object.
  const params = useParams<{ id: string }>();
  const id = params.id;

  const router = useRouter();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getRecipeById(id)
      .then(setRecipe)
      .finally(() => setLoading(false));
  }, [id]);

  // Load the favorite state for this recipe, mirroring the catalog behaviour.
  useEffect(() => {
    if (!user || !id) {
      setIsFavorite(false);
      return;
    }
    getFavorites(user._id).then((favs) =>
      setIsFavorite(favs.some((r) => r._id === id))
    );
  }, [user, id]);

  const handleToggleFavorite = async () => {
    // Protected action: require a session before marking favorites.
    if (!user) {
      router.push("/login");
      return;
    }
    const { favorited } = await toggleFavorite(user._id, id);
    setIsFavorite(favorited);
  };

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-5xl p-4 sm:p-6 lg:p-8">
        <div className="h-96 animate-pulse rounded-2xl bg-gray-200" />
      </main>
    );
  }

  if (!recipe) {
    return (
      <main className="mx-auto w-full max-w-5xl p-6">
        <p className="text-gray-600">Receta no encontrada.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-5xl p-4 sm:p-6 lg:p-8">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* Image on top (mobile) / left (desktop), content beside it. */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative h-64 w-full sm:h-80 md:h-full md:min-h-[420px]">
            <Image
              src={recipe.image || "https://placehold.co/600x400?text=Sin+imagen"}
              alt={recipe.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            {/* Favorite toggle: same state and behaviour as the other views. */}
            <button
              type="button"
              aria-label="Marcar favorito"
              onClick={handleToggleFavorite}
              className={`absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-2xl leading-none shadow transition hover:bg-white ${
                isFavorite ? "text-red-500" : "text-gray-700"
              }`}
            >
              {isFavorite ? "♥" : "♡"}
            </button>
          </div>

          <div className="flex flex-col gap-6 p-6 sm:p-8">
            <header>
              <h1 className="text-2xl font-bold sm:text-3xl">{recipe.name}</h1>
              {/* Meta as badges for an attractive, scannable summary. */}
              <div className="mt-3 flex flex-wrap gap-2 text-sm">
                <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700">
                  ⏱️ {recipe.prepTime} min
                </span>
                <span
                  className={`rounded-full px-3 py-1 ${difficultyStyle[recipe.difficulty]}`}
                >
                  {difficultyLabel[recipe.difficulty]}
                </span>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700">
                  🍽️ {recipe.servings} porciones
                </span>
              </div>
            </header>

            <section>
              <h2 className="mb-2 text-lg font-semibold">Ingredientes</h2>
              <ul className="list-disc space-y-1 pl-5 text-gray-700">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold">Preparación</h2>
              <ol className="list-decimal space-y-2 pl-5 text-gray-700">
                {recipe.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
