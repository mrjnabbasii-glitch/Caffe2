import { Router } from 'express'
import { handle } from '../../controllers/auth/login.controller.js'

export default function createLoginRouter({ limiter }) {
  const router = Router()
  router.post('/', limiter, handle)
  return router
}
