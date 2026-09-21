import { AppError } from '../middleware/error-handler.js'
import { createCategory, deleteCategory, findAllCategories, findCategoryById, updateCategory } from '../repositories/category.repository.js'

export { findAllCategories }

export async function getCategory(categoryId: string) {
  const category = await findCategoryById(categoryId)
  if (!category) throw new AppError(404, 'Kategorin kunde inte hittas.')
  return category
}

export function createNewCategory(input: { name: string; description?: string; image?: string }) {
  return createCategory(input)
}

export async function editCategory(categoryId: string, input: Record<string, unknown>) {
  const category = await updateCategory(categoryId, input)
  if (!category) throw new AppError(404, 'Kategorin kunde inte hittas.')
  return category
}

export async function removeCategory(categoryId: string) {
  const category = await deleteCategory(categoryId)
  if (!category) throw new AppError(404, 'Kategorin kunde inte hittas.')
}