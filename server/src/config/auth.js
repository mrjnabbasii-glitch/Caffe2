export const COOKIE_NAME = 'cafe_session'
export const SESSION_DAYS = 7
export const SESSION_MS = SESSION_DAYS * 24 * 60 * 60 * 1000
// A function (not a constant) so NODE_ENV is read at request time, not at import time.
export const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/api'
})
