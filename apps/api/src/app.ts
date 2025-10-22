import express from 'express'
import helmet from 'helmet'
import pinoHttp from 'pino-http'
import cookieParser from 'cookie-parser'
import cookieSession from 'cookie-session'
import csrf from 'csurf'
import { authRouter } from './routes/auth'
import { incidentsRouter } from './routes/incidents'

const app = express()

app.use(helmet())
app.use(express.json())
app.use(cookieParser())
app.use(pinoHttp())

app.use(
  cookieSession({
    name: 'sirt_sess',
    secret: process.env.SESSION_SECRET || 'dev_secret',
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
  })
)

app.use((req, _res, next) => {
  const user = (req.session as any)?.user
  if (user) req.user = user
  next()
})

const csrfProtection = csrf({ cookie: true })

app.get('/health', (_req, res) => res.json({ ok: true }))

app.use('/auth', authRouter(csrfProtection))
app.use('/incidents', incidentsRouter(csrfProtection))

app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (err && err.code === 'EBADCSRFTOKEN') {
      return res.status(403).json({ error: 'invalid_csrf_token' })
    }
    return next(err)
  }
)

app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error('UNHANDLED ERROR:', err?.stack || err)
    const status = err?.status || 500
    res
      .status(status)
      .json({ error: status === 500 ? 'server_error' : err.message })
  }
)

export { app }
