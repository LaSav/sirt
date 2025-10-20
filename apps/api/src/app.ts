import express from 'express'
import helmet from 'helmet'
import pinoHttp from 'pino-http'
import cookieSession from 'cookie-session'
import csrf from 'csurf'
import { authRouter } from './routes/auth'
import { incidentsRouter } from './routes/incidents'

const app = express()

app.use(helmet())
app.use(express.json())
app.use(pinoHttp())

app.use(
  cookieSession({
    name: 'sirt_sess',
    secret: process.env.SESSION_SECRET || 'dev_secret',
    httpOnly: true,
    sameSite: 'lax',
    secure: false, // set true behind HTTPS
  })
)

// Expose a tiny user extractor (for demo)
app.use((req, _res, next) => {
  const user = (req.session as any)?.user
  if (user) req.user = user
  next()
})

// CSRF (use cookie token)
const csrfProtection = csrf({ cookie: true })
app.use((req, res, next) => {
  // allow GETs without token, protect state-changing below per-route
  next()
})

app.get('/health', (_req, res) => res.json({ ok: true }))
app.use('/auth', authRouter(csrfProtection))
app.use('/incidents', incidentsRouter(csrfProtection))

// Error handler
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(err)
    const status = err.status || 500
    res
      .status(status)
      .json({ error: status === 500 ? 'server_error' : err.message })
  }
)

export { app }
