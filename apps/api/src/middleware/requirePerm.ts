import { Request, Response, NextFunction } from 'express'
import { can } from '../rbac'
import type { Role } from '../rbac'

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: Role; email: string }
    }
  }
}

export const requirePerm =
  (check: (role: Role) => boolean) =>
  (req: Request, res: Response, next: NextFunction) => {
    const role = req.user?.role
    if (!role || !check(role))
      return res.status(403).json({ error: 'forbidden' })
    next()
  }
