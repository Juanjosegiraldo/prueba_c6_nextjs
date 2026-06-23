"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button, Card } from "@heroui/react";

// All data and behaviour come from props.
interface RecipeCardProps {
  id: string;
  name: string;
  image: string;
  prepTime: number;
  difficulty: "easy" | "medium" | "hard";
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

// Human-readable label for the difficulty enum.
const difficultyLabel: Record<RecipeCardProps["difficulty"], string> = {
  easy: "Fácil",
  medium: "Media",
  hard: "Difícil",
};

export default function RecipeCard({
  id,
  name,
  image,
  prepTime,
  difficulty,
  isFavorite,
  onToggleFavorite,
}: RecipeCardProps) {
  const router = useRouter();

  return (
    <Card className="w-full transition hover:shadow-lg">
      <Card.Content className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={image || "https://placehold.co/400x300?text=Sin+imagen"}
            alt={name}
            fill
            sizes="256px"
            className="object-cover"
          />
          {/* Favorite toggle: data comes from props, behaviour from props. */}
          <button
            type="button"
            aria-label="Marcar favorito"
            onClick={() => onToggleFavorite(id)}
            className={`absolute right-2 top-2 rounded-full bg-white/80 px-2 py-1 text-xl leading-none transition hover:bg-white ${
              isFavorite ? "text-red-500" : "text-gray-700"
            }`}
          >
            {isFavorite ? "♥" : "♡"}
          </button>
        </div>
      </Card.Content>

      <Card.Footer className="flex flex-col items-start gap-2">
        <h3 className="font-semibold">{name}</h3>
        <p className="text-sm text-gray-600">⏱️ {prepTime} min</p>
        <p className="text-sm text-gray-600">Dificultad: {difficultyLabel[difficulty]}</p>
        {/* Programmatic navigation to the dynamic detail route. */}
        <Button fullWidth onPress={() => router.push(`/recipes/${id}`)}>
          Ver receta
        </Button>
      </Card.Footer>
    </Card>
  );
}
