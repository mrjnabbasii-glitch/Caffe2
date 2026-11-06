import { Router } from 'express'
import { handle } from '../../controllers/auth/signup.controller.js'

export default function createSignupRouter({ limiter }) {
  const router = Router()
  router.post('/', limiter, handle)
  return router
}
