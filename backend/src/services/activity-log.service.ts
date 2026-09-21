import type { Request } from 'express'

import { ActivityLogModel, type ActivityAction } from '../models/activity-log.model.js'

export async function recordActivity(input: { request?: Request; userId?: string; action: ActivityAction; entityType?: string; entityId?: string; metadata?: Record<string, string> }) {
  await ActivityLogModel.create({ userId: input.userId, action: input.action, entityType: input.entityType, entityId: input.entityId, metadata: input.metadata, ipAddress: input.request?.ip })
}

export function listActivities(limit = 100) {
  return ActivityLogModel.find().sort({ createdAt: -1 }).limit(Math.min(limit, 250)).populate('userId', 'username email').lean().exec()
}