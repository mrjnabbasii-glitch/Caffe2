import { Router } from 'express'
import { requireAuth } from '../../middleware/auth.js'
import { handle } from '../../controllers/reservations/list-reservations.controller.js'

export default function createListReservationsRouter() {
  const router = Router()
  router.get('/', requireAuth, handle)
  return router
}
