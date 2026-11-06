import { createHash, randomBytes } from 'node:crypto'
import { Session } from '../../models/session.model.js'
import { COOKIE_NAME, SESSION_MS } from '../../config/auth.js'

// Only the SHA-256 hash of a token is stored, so a database leak does not leak live sessions.
export const hashToken = (token) => createHash('sha256').update(token).digest('hex')

// Creates a new random session token. If the browser already had one, it is replaced
// (session rotation), so an old token can never be reused after login.
export async function createSession(userId, previousToken, passwordVersion = 0) {
  const token = randomBytes(32).toString('hex')
  await Session.create({
    tokenHash: hashToken(token),
    userId,
    passwordVersion,
    expiresAt: new Date(Date.now() + SESSION_MS)
  })
  if (previousToken) await revokeSession(previousToken)
  return token
}

export async function revokeSession(token) {
  if (token) await Session.deleteOne({ tokenHash: hashToken(token) })
}

// Reads our cookie from the raw "Cookie: a=1; cafe_session=..." header.
export function readToken(req) {
  return req.headers.cookie
    ?.split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(COOKIE_NAME + '='))
    ?.slice(COOKIE_NAME.length + 1)
}
