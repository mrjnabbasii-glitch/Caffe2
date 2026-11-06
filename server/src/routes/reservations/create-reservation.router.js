import { Router } from 'express'
import { requireAuth } from '../../middleware/auth.js'
import { handle } from '../../controllers/reservations/create-reservation.controller.js'

export default function createCreateReservationRouter() {
  const router = Router()
  router.post('/', requireAuth, handle)
  return router
}
