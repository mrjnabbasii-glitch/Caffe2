import { randomBytes } from 'node:crypto'
import { User } from '../../models/user.model.js'
import { hashToken } from './session.service.js'
import {
  assertMailConfigured,
  resetOrigin,
  sendPasswordResetEmail
} from '../mail/password-reset-mail.service.js'

export const RESET_MS = 15 * 60 * 1000
export async function requestPasswordReset({ email }, sendResetEmail) {
  if (!sendResetEmail) assertMailConfigured()
  const origin = resetOrigin()
  const token = randomBytes(32).toString('hex')
  const tokenHash = hashToken(token)
  const now = new Date()
  const expiresAt = new Date(now.getTime() + RESET_MS)
  // A one-minute cooldown prevents mailbox flooding and leaves the latest link usable.
  const user = await User.findOneAndUpdate(
    {
      email,
      $or: [
        { resetRequestedAt: { $exists: false } },
        { resetRequestedAt: { $lte: new Date(now.getTime() - 60000) } }
      ]
    },
    { $set: { resetTokenHash: tokenHash, resetExpiresAt: expiresAt, resetRequestedAt: now } },
    { returnDocument: 'after' }
  ).lean()
  if (!user) return
  try {
    await (sendResetEmail || sendPasswordResetEmail)({
      to: user.email,
      url: origin + '/reset-password#token=' + token,
      expiresAt
    })
  } catch (error) {
    await User.updateOne(
      { _id: user._id, resetTokenHash: tokenHash },
      { $unset: { resetTokenHash: 1, resetExpiresAt: 1, resetRequestedAt: 1 } }
    )
    // Do not disclose whether the email exists, credentials, or the reset link.
    console.error('Password-recovery delivery failed:', error.code || error.name)
  }
}
