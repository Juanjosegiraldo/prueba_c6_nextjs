import { Schema, model, models, Model } from "mongoose";

// Domain shape of a recipe. `_id` is not declared here: Mongoose adds it
// automatically and the service layer exposes it as a string (see Recipe type).
export interface IRecipe {
  name: string;
  image: string;
  // Fields shown on the card (listing):
  prepTime: number;
  difficulty: "easy" | "medium" | "hard";
  // Extended fields shown only on the recipe detail page:
  ingredients: string[];
  steps: string[];
  servings: number;
  createdAt: Date;
  updatedAt: Date;
}

const recipeSchema = new Schema<IRecipe>(
  {
    name: { type: String, required: true, trim: true },
    image: { type: String, default: "" },
    prepTime: { type: Number, required: true, min: 0 },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },
    ingredients: { type: [String], default: [] },
    steps: { type: [String], default: [] },
    servings: { type: Number, default: 1, min: 1 },
  },
  { timestamps: true }
);

// models.Recipe || model(...) avoids OverwriteModelError on hot reload.
export const Recipe: Model<IRecipe> =
  (models.Recipe as Model<IRecipe>) || model<IRecipe>("Recipe", recipeSchema);
