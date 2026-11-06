import { Router } from 'express'
import { requireAuth } from '../../middleware/auth.js'
import { handle } from '../../controllers/auth/me.controller.js'

export default function createMeRouter() {
  const router = Router()
  router.get('/', requireAuth, handle)
  return router
}
