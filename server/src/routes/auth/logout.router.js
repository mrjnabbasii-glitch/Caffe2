import { Router } from 'express'
import { handle } from '../../controllers/auth/logout.controller.js'

export default function createLogoutRouter() {
  const router = Router()
  router.post('/', handle)
  return router
}
