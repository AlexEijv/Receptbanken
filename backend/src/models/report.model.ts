import { Schema, Types, model } from 'mongoose'

export interface ReportDocument { recipeId: Types.ObjectId; userId: Types.ObjectId; reason: string; status: 'open' | 'resolved'; createdAt: Date; updatedAt: Date }
const reportSchema = new Schema<ReportDocument>({ recipeId: { type: Schema.Types.ObjectId, ref: 'Recipe', required: true, index: true }, userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, reason: { type: String, required: true, trim: true, maxlength: 500 }, status: { type: String, enum: ['open', 'resolved'], default: 'open', index: true } }, { timestamps: true })
reportSchema.index({ recipeId: 1, userId: 1, status: 1 })
export const ReportModel = model<ReportDocument>('Report', reportSchema)