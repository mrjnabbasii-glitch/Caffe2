import { revokeSession, readToken } from '../../services/auth/session.service.js'
import { clearSessionCookie } from '../../utils/session-cookie.js'
import { parseRequest } from '../../dto/auth/logout.dto.js'

export async function handle(req, res) {
  parseRequest(req)
  await revokeSession(readToken(req))
  clearSessionCookie(res)
  res.status(204).end()
}
