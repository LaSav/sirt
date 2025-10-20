import { Request, Response, NextFunction } from 'express'
import { can } from '../rbac'

declare module 'express-session' {
  interface SessionData {
    user?: { id: string; role: string; email: string }
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: string; email: string }
    }
  }
}

export const requirePerm =
  (check: (role: string) => boolean) =>
  (req: Request, res: Response, next: NextFunction) => {
    const role = req.user?.role
    if (!role || !check(role))
      return res.status(403).json({ error: 'forbidden' })
    next()
  }
