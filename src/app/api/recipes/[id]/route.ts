import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/database";
import { Recipe, type IRecipe } from "@/database/models/Recipe";

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/recipes/[id] — one recipe, 404 if it does not exist.
export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    await connectDB();

    if (!isValidObjectId(id)) {
      return Response.json(
        { data: null, code: 404, message: "Recipe not found" },
        { status: 404 }
      );
    }

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return Response.json(
        { data: null, code: 404, message: "Recipe not found" },
        { status: 404 }
      );
    }

    return Response.json(
      { data: recipe, code: 200, message: "Recipe retrieved" },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ data: null, code: 500, message }, { status: 500 });
  }
}

// PUT /api/recipes/[id] — partial update.
export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    await connectDB();

    if (!isValidObjectId(id)) {
      return Response.json(
        { data: null, code: 404, message: "Recipe not found" },
        { status: 404 }
      );
    }

    const body: Partial<IRecipe> = await request.json();
    const recipe = await Recipe.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!recipe) {
      return Response.json(
        { data: null, code: 404, message: "Recipe not found" },
        { status: 404 }
      );
    }

    return Response.json(
      { data: recipe, code: 200, message: "Recipe updated" },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ data: null, code: 400, message }, { status: 400 });
  }
}

// DELETE /api/recipes/[id] — remove a recipe.
export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    await connectDB();

    if (!isValidObjectId(id)) {
      return Response.json(
        { data: null, code: 404, message: "Recipe not found" },
        { status: 404 }
      );
    }

    const recipe = await Recipe.findByIdAndDelete(id);
    if (!recipe) {
      return Response.json(
        { data: null, code: 404, message: "Recipe not found" },
        { status: 404 }
      );
    }

    return Response.json(
      { data: recipe, code: 200, message: "Recipe deleted" },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ data: null, code: 500, message }, { status: 500 });
  }
}
