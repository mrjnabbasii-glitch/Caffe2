import { parseRequest, toResponse } from '../../dto/auth/forgot-password.dto.js'
import { requestPasswordReset } from '../../services/auth/forgot-password.service.js'

export function createHandler(sendResetEmail) {
  return async function handle(req, res) {
    await requestPasswordReset(parseRequest(req), sendResetEmail)
    res.status(202).json(toResponse())
  }
}
