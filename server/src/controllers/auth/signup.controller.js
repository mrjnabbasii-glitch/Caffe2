import { register } from '../../services/auth/register.service.js'
import { createSession, readToken } from '../../services/auth/session.service.js'
import { setSessionCookie } from '../../utils/session-cookie.js'
import { parseRequest, toResponse } from '../../dto/auth/signup.dto.js'

export async function handle(req, res) {
  const user = await register(parseRequest(req))
  const token = await createSession(user._id, readToken(req), user.passwordVersion ?? 0)
  setSessionCookie(res, token)
  res.status(201).json(toResponse(user))
}
