import { Schema, model, models, Model, Types } from "mongoose";

export interface IFavorite {
  userId: Types.ObjectId;
  recipeId: Types.ObjectId;
  createdAt: Date;
}

const favoriteSchema = new Schema<IFavorite>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    recipeId: { type: Schema.Types.ObjectId, ref: "Recipe", required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// A user cannot favorite the same recipe twice.
favoriteSchema.index({ userId: 1, recipeId: 1 }, { unique: true });

export const Favorite: Model<IFavorite> =
  (models.Favorite as Model<IFavorite>) || model<IFavorite>("Favorite", favoriteSchema);
