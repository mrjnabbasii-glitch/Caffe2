import { Router } from 'express'
import { handle } from '../../controllers/auth/reset-password.controller.js'

export default function createResetPasswordRouter({ limiter }) {
  const router = Router()
  router.post('/', limiter, handle)
  return router
}
