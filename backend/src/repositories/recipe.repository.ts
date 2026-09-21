import { RecipeModel } from '../models/recipe.model.js'
import { ReviewModel } from '../models/review.model.js'

export interface RecipeFilters {
  search?: string
  categoryId?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  ingredient?: string
  tag?: string
  maxTime?: number
}

export type RecipeSort = 'newest' | 'oldest' | 'titleAsc' | 'titleDesc' | 'shortest' | 'longest' | 'popular' | 'recommended'

export function findRecipeById(recipeId: string) {
  return RecipeModel.findById(recipeId).populate('categoryId', 'name').populate('authorId', 'username profileImage').lean().exec()
}

export function findRecipesByAuthor(authorId: string) {
  return RecipeModel.find({ authorId }).sort({ createdAt: -1 }).lean().exec()
}

export async function findRecipes(filters: RecipeFilters, sort: RecipeSort, page: number, limit: number) {
  const query: Record<string, unknown> = {}

  if (filters.search) query.$text = { $search: filters.search }
  if (filters.categoryId) query.categoryId = filters.categoryId
  if (filters.difficulty) query.difficulty = filters.difficulty
  if (filters.ingredient) query['ingredients.name'] = { $regex: filters.ingredient, $options: 'i' }
  if (filters.tag) query.tags = filters.tag.toLowerCase()
  if (filters.maxTime !== undefined) {
    query.$expr = { $lte: [{ $add: ['$prepTime', '$cookTime'] }, filters.maxTime] }
  }

  const sortOptions: Partial<Record<RecipeSort, Record<string, 1 | -1>>> = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    titleAsc: { title: 1 },
    titleDesc: { title: -1 },
    shortest: { cookTime: 1 },
    longest: { cookTime: -1 },
  }
  const sortValue = sortOptions[sort] ?? { createdAt: -1 }

  const [items, total] = await Promise.all([
    RecipeModel.find(query)
      .sort(sortValue)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('categoryId', 'name')
      .populate('authorId', 'username profileImage')
      .lean()
      .exec(),
    RecipeModel.countDocuments(query).exec(),
  ])

  const stats = await ReviewModel.aggregate<{ _id: unknown; reviewCount: number; averageRating: number }>([
    { $match: { recipeId: { $in: items.map((item) => item._id) } } },
    { $group: { _id: '$recipeId', reviewCount: { $sum: 1 }, averageRating: { $avg: '$rating' } } },
  ]).exec()
  const statMap = new Map(stats.map((stat) => [String(stat._id), stat]))
  const enrichedItems = items.map((item) => ({ ...item, reviewCount: statMap.get(String(item._id))?.reviewCount ?? 0, averageRating: statMap.get(String(item._id))?.averageRating ?? 0 }))
  if (sort === 'popular' || sort === 'recommended') {
    enrichedItems.sort((a, b) => {
      const score = (item: typeof a) => sort === 'popular' ? item.reviewCount * item.averageRating : item.averageRating * 0.7 + Math.log1p(item.reviewCount) * 0.3
      return score(b) - score(a)
    })
  }
  return { items: enrichedItems, total }
}

export function updateRecipe(recipeId: string, input: Record<string, unknown>) {
  return RecipeModel.findByIdAndUpdate(recipeId, input, { returnDocument: 'after', runValidators: true }).lean().exec()
}

export function deleteRecipe(recipeId: string) {
  return RecipeModel.findByIdAndDelete(recipeId).lean().exec()
}

export function createRecipe(input: Parameters<typeof RecipeModel.create>[0]) {
  return RecipeModel.create(input)
}

export function incrementRecipeViews(recipeId: string) {
  return RecipeModel.findByIdAndUpdate(recipeId, { $inc: { views: 1 } }, { returnDocument: 'after' }).lean().exec()
}