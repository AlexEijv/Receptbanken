import { Schema, model } from 'mongoose'

export interface CategoryDocument {
  name: string
  description?: string
  image?: string
  createdAt: Date
  updatedAt: Date
}

const categorySchema = new Schema<CategoryDocument>(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
    description: { type: String, trim: true, maxlength: 300 },
    image: { type: String, trim: true, maxlength: 500 },
  },
  { timestamps: true },
)

categorySchema.index({ name: 1 }, { unique: true })

export const CategoryModel = model<CategoryDocument>('Category', categorySchema)