import { Router } from 'express'
import { requireAuth } from '../../middleware/auth.js'
import { handle } from '../../controllers/reservations/get-reservation.controller.js'

export default function createGetReservationRouter() {
  const router = Router({ mergeParams: true })
  router.get('/', requireAuth, handle)
  return router
}
