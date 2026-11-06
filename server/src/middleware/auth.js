import { Session } from '../models/session.model.js'
import { User } from '../models/user.model.js'
import { readToken, hashToken } from '../services/auth/session.service.js'
import { clearSessionCookie } from '../utils/session-cookie.js'
import { fail } from '../utils/http-error.js'

// Guards private routes: valid cookie -> live session -> existing user, else 401.
// On success it puts the user on req.user for the controllers.
export async function requireAuth(req, res, next) {
  const token = readToken(req)
  if (!token || !/^[a-f0-9]{64}$/.test(token)) fail(401, 'برای ادامه وارد حساب خود شوید.')
  const session = await Session.findOne({
    tokenHash: hashToken(token),
    expiresAt: { $gt: new Date() }
  }).lean()
  const user = session && (await User.findById(session.userId).lean())
  // A password change bumps passwordVersion, which invalidates every older session.
  if (!user || (session.passwordVersion ?? 0) !== (user.passwordVersion ?? 0)) {
    clearSessionCookie(res)
    fail(401, 'نشست شما منقضی شده است؛ دوباره وارد شوید.')
  }
  req.user = user
  // Reservations store a hash of the account id as their owner (kept for existing data).
  req.ownerHash = hashToken(user._id.toString())
  next()
}
