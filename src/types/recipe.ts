export interface RecipeIngredient {
  amount: string
  name: string
}

export interface RecipeInstruction {
  step: number
  text: string
}

export interface Recipe {
  _id: string
  title: string
  description: string
  image?: string
  images?: string[]
  ingredients: RecipeIngredient[]
  instructions: RecipeInstruction[]
  prepTime: number
  cookTime: number
  servings: number
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]
  reviewCount?: number
  averageRating?: number
  categoryId?: { _id: string; name: string } | string
  authorId?: { _id: string; username: string } | string
}

export interface RecipeQuery {
  search?: string
  category?: string
  difficulty?: Recipe['difficulty']
  maxTime?: number
  sort?: 'newest' | 'oldest' | 'titleAsc' | 'titleDesc' | 'shortest' | 'longest' | 'popular' | 'recommended'
  page?: number
  limit?: number
}