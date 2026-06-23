import { connectDB } from "@/lib/database";
import { Recipe } from "@/database/models/Recipe";

// GET /api/recipes — paginated catalog listing.
// Query params: page (1-based, default 1) and limit (default 12, max 50).
// Returns only the requested page so the client never loads the full DB at once.
export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 12));
    const skip = (page - 1) * limit;

    // total drives "hasMore"; the slice is fetched with skip/limit.
    const [recipes, total] = await Promise.all([
      Recipe.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Recipe.countDocuments(),
    ]);

    return Response.json(
      {
        data: recipes,
        page,
        limit,
        total,
        hasMore: skip + recipes.length < total,
        code: 200,
        message: "Recipes retrieved",
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ data: null, code: 500, message }, { status: 500 });
  }
}

// POST /api/recipes — create a recipe (name and prepTime required).
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    if (typeof body.name !== "string" || body.name.trim() === "") {
      return Response.json(
        { data: null, code: 400, message: "name is required" },
        { status: 400 }
      );
    }
    if (typeof body.prepTime !== "number" || body.prepTime < 0) {
      return Response.json(
        { data: null, code: 400, message: "prepTime must be a number >= 0" },
        { status: 400 }
      );
    }

    const recipe = await Recipe.create({
      name: body.name,
      image: body.image,
      prepTime: body.prepTime,
      difficulty: body.difficulty,
      ingredients: body.ingredients,
      steps: body.steps,
      servings: body.servings,
    });

    return Response.json(
      { data: recipe, code: 201, message: "Recipe created" },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ data: null, code: 400, message }, { status: 400 });
  }
}
