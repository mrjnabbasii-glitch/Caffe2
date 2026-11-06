import { parseRequest, toResponse } from '../../dto/auth/reset-password.dto.js'
import { resetPassword } from '../../services/auth/reset-password.service.js'
import { clearSessionCookie } from '../../utils/session-cookie.js'

export async function handle(req, res) {
  await resetPassword(parseRequest(req))
  clearSessionCookie(res)
  res.json(toResponse())
}
