import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/database";
import { Favorite } from "@/database/models/Favorite";
import { Recipe } from "@/database/models/Recipe";

// GET /api/favorites?userId=... — the favorited recipes of a user.
export async function GET(request: Request) {
  try {
    await connectDB();
    const userId = new URL(request.url).searchParams.get("userId") ?? "";

    if (!isValidObjectId(userId)) {
      return Response.json(
        { data: null, code: 400, message: "Invalid user id" },
        { status: 400 }
      );
    }

    const favorites = await Favorite.find({ userId });
    const recipeIds = favorites.map((fav) => fav.recipeId);
    const recipes = await Recipe.find({ _id: { $in: recipeIds } });

    return Response.json(
      { data: recipes, code: 200, message: "Favorites retrieved" },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ data: null, code: 500, message }, { status: 500 });
  }
}

// POST /api/favorites — toggle a favorite for a user/recipe pair.
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const userId = typeof body.userId === "string" ? body.userId : "";
    const recipeId = typeof body.recipeId === "string" ? body.recipeId : "";

    if (!isValidObjectId(userId) || !isValidObjectId(recipeId)) {
      return Response.json(
        { data: null, code: 400, message: "Invalid user or recipe id" },
        { status: 400 }
      );
    }

    const existing = await Favorite.findOne({ userId, recipeId });
    if (existing) {
      await existing.deleteOne();
      return Response.json(
        { data: { favorited: false }, code: 200, message: "Favorite removed" },
        { status: 200 }
      );
    }

    await Favorite.create({ userId, recipeId });
    return Response.json(
      { data: { favorited: true }, code: 201, message: "Favorite added" },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ data: null, code: 400, message }, { status: 400 });
  }
}
