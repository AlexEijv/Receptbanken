import { CategoryModel } from '../models/category.model.js'

export function findAllCategories() {
  return CategoryModel.find().sort({ name: 1 }).lean().exec()
}

export function findCategoryById(categoryId: string) {
  return CategoryModel.findById(categoryId).lean().exec()
}

export function createCategory(input: { name: string; description?: string; image?: string }) {
  return CategoryModel.create(input)
}

export function updateCategory(categoryId: string, input: Record<string, unknown>) {
  return CategoryModel.findByIdAndUpdate(categoryId, input, { returnDocument: 'after', runValidators: true }).lean().exec()
}

export function deleteCategory(categoryId: string) {
  return CategoryModel.findByIdAndDelete(categoryId).lean().exec()
}