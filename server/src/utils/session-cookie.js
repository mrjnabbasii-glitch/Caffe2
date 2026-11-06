import { COOKIE_NAME, SESSION_MS, cookieOptions } from '../config/auth.js'

export function setSessionCookie(res, token) {
  res.cookie(COOKIE_NAME, token, { ...cookieOptions(), maxAge: SESSION_MS })
}
export function clearSessionCookie(res) {
  res.clearCookie(COOKIE_NAME, cookieOptions())
}
