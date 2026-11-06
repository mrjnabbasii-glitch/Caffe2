import { Router } from 'express'
import { rateLimit } from 'express-rate-limit'
import createSignupRouter from './auth/signup.router.js'
import createLoginRouter from './auth/login.router.js'
import createMeRouter from './auth/me.router.js'
import createLogoutRouter from './auth/logout.router.js'
import createForgotPasswordRouter from './auth/forgot-password.router.js'
import createResetPasswordRouter from './auth/reset-password.router.js'

const FIFTEEN_MINUTES = 15 * 60 * 1000

// Brute-force protection: each IP gets a limited number of attempts per window.
function createLimiter(limit, message) {
  return rateLimit({
    windowMs: FIFTEEN_MINUTES,
    limit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { message }
  })
}

export function createAuthRouter({ sendResetEmail } = {}) {
  const router = Router()
  const loginLimiter = createLimiter(20, 'تلاش‌های زیادی انجام شده؛ چند دقیقه صبر کنید.')
  const recoveryLimiter = createLimiter(
    10,
    'درخواست‌های بازیابی زیادی ارسال شده؛ چند دقیقه صبر کنید.'
  )

  const signupRouter = createSignupRouter({ limiter: loginLimiter })
  router.use('/signup', signupRouter)
  router.use('/register', signupRouter) // Older name for signup, kept for existing clients.
  router.use('/login', createLoginRouter({ limiter: loginLimiter }))
  router.use('/me', createMeRouter())
  router.use('/logout', createLogoutRouter())
  router.use(
    '/forgot-password',
    createForgotPasswordRouter({ limiter: recoveryLimiter, sendResetEmail })
  )
  router.use('/reset-password', createResetPasswordRouter({ limiter: recoveryLimiter }))
  return router
}
