import { connectDB } from "@/lib/database";
import { Recipe, type IRecipe } from "@/database/models/Recipe";
import { buscarImagen } from "@/helpers/pexels";

// Sample catalog data. The image is NOT set here: the seed fetches a matching
// photo by name from Pexels so the catalog fills up without manual uploads.
const sampleRecipes: Omit<IRecipe, "image" | "createdAt" | "updatedAt">[] = [
  {
    name: "Spaghetti a la Boloñesa",
    prepTime: 40,
    difficulty: "medium",
    servings: 4,
    ingredients: [
      "400g de espagueti",
      "300g de carne molida",
      "1 cebolla",
      "2 dientes de ajo",
      "400g de tomate triturado",
      "Aceite de oliva, sal y pimienta",
    ],
    steps: [
      "Sofreír la cebolla y el ajo picados.",
      "Agregar la carne molida y dorar.",
      "Añadir el tomate triturado y cocinar 20 minutos.",
      "Hervir la pasta al dente y mezclar con la salsa.",
    ],
  },
  {
    name: "Ensalada César",
    prepTime: 15,
    difficulty: "easy",
    servings: 2,
    ingredients: [
      "1 lechuga romana",
      "Pechuga de pollo a la plancha",
      "Crutones",
      "Queso parmesano",
      "Aderezo César",
    ],
    steps: [
      "Trocear la lechuga y disponerla en un bol.",
      "Agregar el pollo en tiras y los crutones.",
      "Añadir el aderezo y mezclar.",
      "Espolvorear parmesano por encima.",
    ],
  },
  {
    name: "Tortilla de Patatas",
    prepTime: 30,
    difficulty: "medium",
    servings: 4,
    ingredients: [
      "5 patatas medianas",
      "6 huevos",
      "1 cebolla",
      "Aceite de oliva",
      "Sal",
    ],
    steps: [
      "Pelar y cortar las patatas en láminas finas.",
      "Freír las patatas con la cebolla a fuego medio.",
      "Batir los huevos y mezclar con las patatas.",
      "Cuajar la tortilla por ambos lados.",
    ],
  },
  {
    name: "Tacos al Pastor",
    prepTime: 50,
    difficulty: "hard",
    servings: 4,
    ingredients: [
      "500g de carne de cerdo",
      "Tortillas de maíz",
      "Piña",
      "Cebolla y cilantro",
      "Achiote y especias",
    ],
    steps: [
      "Marinar la carne con achiote y especias.",
      "Asar la carne y cortar en trozos pequeños.",
      "Calentar las tortillas.",
      "Servir con piña, cebolla y cilantro.",
    ],
  },
  {
    name: "Panqueques",
    prepTime: 20,
    difficulty: "easy",
    servings: 3,
    ingredients: [
      "200g de harina",
      "2 huevos",
      "300ml de leche",
      "1 cucharada de azúcar",
      "Mantequilla",
    ],
    steps: [
      "Mezclar la harina, los huevos, la leche y el azúcar.",
      "Calentar una sartén con mantequilla.",
      "Verter un poco de masa y cocinar por ambos lados.",
      "Servir con miel o frutas.",
    ],
  },
  {
    name: "Sopa de Tomate",
    prepTime: 25,
    difficulty: "easy",
    servings: 4,
    ingredients: [
      "6 tomates maduros",
      "1 cebolla",
      "1 diente de ajo",
      "Caldo de verduras",
      "Albahaca fresca",
    ],
    steps: [
      "Sofreír la cebolla y el ajo.",
      "Agregar los tomates troceados.",
      "Añadir el caldo y cocinar 15 minutos.",
      "Triturar y servir con albahaca.",
    ],
  },
  {
    name: "Pollo al Curry",
    prepTime: 45,
    difficulty: "medium",
    servings: 4,
    ingredients: [
      "500g de pechuga de pollo",
      "1 lata de leche de coco",
      "2 cucharadas de pasta de curry",
      "1 cebolla",
      "Arroz blanco",
    ],
    steps: [
      "Dorar el pollo en trozos.",
      "Sofreír la cebolla y añadir la pasta de curry.",
      "Agregar la leche de coco y cocinar a fuego lento.",
      "Servir con arroz blanco.",
    ],
  },
  {
    name: "Brownie de Chocolate",
    prepTime: 35,
    difficulty: "medium",
    servings: 6,
    ingredients: [
      "200g de chocolate negro",
      "150g de mantequilla",
      "3 huevos",
      "150g de azúcar",
      "100g de harina",
    ],
    steps: [
      "Derretir el chocolate con la mantequilla.",
      "Batir los huevos con el azúcar.",
      "Mezclar todo con la harina.",
      "Hornear a 180°C durante 25 minutos.",
    ],
  },
];

// POST /api/seed — reset the catalog and auto-assign an image per recipe.
export async function POST() {
  try {
    await connectDB();
    await Recipe.deleteMany({});

    // Resolve one image per recipe by its name.
    const withImages = await Promise.all(
      sampleRecipes.map(async (r) => ({
        ...r,
        image: await buscarImagen(r.name),
      }))
    );

    const recipes = await Recipe.insertMany(withImages);
    return Response.json(
      { data: recipes, code: 201, message: `Seeded ${recipes.length} recipes` },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ data: null, code: 500, message }, { status: 500 });
  }
}
