import { Schema, Types, model } from 'mongoose'

export type RecipeDifficulty = 'easy' | 'medium' | 'hard'

export interface RecipeIngredient {
  amount: string
  name: string
}

export interface RecipeInstruction {
  step: number
  text: string
}

export interface RecipeDocument {
  title: string
  description: string
  image?: string
  images: string[]
  ingredients: RecipeIngredient[]
  instructions: RecipeInstruction[]
  prepTime: number
  cookTime: number
  servings: number
  difficulty: RecipeDifficulty
  categoryId: Types.ObjectId
  tags: string[]
  authorId: Types.ObjectId
  views: number
  createdAt: Date
  updatedAt: Date
}

const ingredientSchema = new Schema<RecipeIngredient>(
  {
    amount: { type: String, required: true, trim: true, maxlength: 50 },
    name: { type: String, required: true, trim: true, maxlength: 100 },
  },
  { _id: false },
)

const instructionSchema = new Schema<RecipeInstruction>(
  {
    step: { type: Number, required: true, min: 1 },
    text: { type: String, required: true, trim: true, maxlength: 1000 },
  },
  { _id: false },
)

const recipeSchema = new Schema<RecipeDocument>(
  {
    title: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 1000 },
    image: { type: String, trim: true, maxlength: 500 },
    images: { type: [String], default: [], validate: [(items: string[]) => items.length <= 10, 'Maximum ten images are allowed.'] },
    ingredients: { type: [ingredientSchema], required: true, validate: [(items: RecipeIngredient[]) => items.length > 0, 'At least one ingredient is required.'] },
    instructions: { type: [instructionSchema], required: true, validate: [(items: RecipeInstruction[]) => items.length > 0, 'At least one instruction is required.'] },
    prepTime: { type: Number, required: true, min: 0, max: 1440 },
    cookTime: { type: Number, required: true, min: 0, max: 1440 },
    servings: { type: Number, required: true, min: 1, max: 100 },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true, index: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    tags: { type: [String], default: [], lowercase: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    views: { type: Number, default: 0, min: 0, index: true },
  },
  { timestamps: true },
)

recipeSchema.index({ createdAt: -1 })
recipeSchema.index({ title: 'text', description: 'text', tags: 'text', 'ingredients.name': 'text' })
recipeSchema.index({ cookTime: 1, difficulty: 1, categoryId: 1 })

export const RecipeModel = model<RecipeDocument>('Recipe', recipeSchema)