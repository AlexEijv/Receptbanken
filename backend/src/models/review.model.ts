import { Schema, Types, model } from 'mongoose'

export interface ReviewDocument {
  recipeId: Types.ObjectId
  userId: Types.ObjectId
  rating: number
  comment: string
  createdAt: Date
  updatedAt: Date
}

const reviewSchema = new Schema<ReviewDocument>({
  recipeId: { type: Schema.Types.ObjectId, ref: 'Recipe', required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, trim: true, maxlength: 1000 },
}, { timestamps: true })

reviewSchema.index({ recipeId: 1, userId: 1 }, { unique: true })
reviewSchema.index({ recipeId: 1, createdAt: -1 })

export const ReviewModel = model<ReviewDocument>('Review', reviewSchema)