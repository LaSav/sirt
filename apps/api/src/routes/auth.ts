import { Router } from 'express'
import { prisma } from '../db'
import { loginSchema } from '../schemas'
import bcrypt from 'bcryptjs'

export const authRouter = (csrfProtection: any) => {
  const r = Router()

  r.post('/login', csrfProtection, async (req, res) => {
    const parsed = loginSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ error: 'invalid_body' })
    const { email, password } = parsed.data
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'invalid_credentials' })
    }
    ;(req.session as any).user = {
      id: user.id,
      email: user.email,
      role: user.role,
    }
    res.json({
      ok: true,
      user: { id: user.id, email: user.email, role: user.role },
    })
  })

  r.post('/logout', csrfProtection, (req, res) => {
    ;(req.session as any) = null
    res.json({ ok: true })
  })

  r.get('/me', (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'unauthenticated' })
    res.json({ user: req.user })
  })

  return r
}
