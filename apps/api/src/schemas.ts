import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const incidentCreate = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(10).max(5000),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  assigneeId: z.string().cuid().optional(),
})

export const incidentPatch = z.object({
  title: z.string().min(3).max(120).optional(),
  description: z.string().min(10).max(5000).optional(),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  status: z
    .enum(['OPEN', 'TRIAGE', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'])
    .optional(),
  assigneeId: z.string().cuid().nullable().optional(),
})

export const noteCreate = z.object({
  body: z.string().min(1).max(2000),
})

export type LoginBody = z.infer<typeof loginSchema>
