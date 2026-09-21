import { Schema, Types, model } from 'mongoose'

export interface FavoriteDocument {
  userId: Types.ObjectId
  recipeId: Types.ObjectId
  createdAt: Date
}

const favoriteSchema = new Schema<FavoriteDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipeId: { type: Schema.Types.ObjectId, ref: 'Recipe', required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

favoriteSchema.index({ userId: 1, recipeId: 1 }, { unique: true })
favoriteSchema.index({ userId: 1, createdAt: -1 })

export const FavoriteModel = model<FavoriteDocument>('Favorite', favoriteSchema)