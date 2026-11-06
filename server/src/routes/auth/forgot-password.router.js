import { Router } from 'express'
import { createHandler } from '../../controllers/auth/forgot-password.controller.js'

export default function createForgotPasswordRouter({ limiter, sendResetEmail }) {
  const router = Router()
  router.post('/', limiter, createHandler(sendResetEmail))
  return router
}
