import { User } from '../../models/user.model.js'
import { Session } from '../../models/session.model.js'
import { hashToken } from './session.service.js'
import { hashPassword } from '../../utils/password.js'
import { fail } from '../../utils/http-error.js'

const INVALID_LINK = 'لینک بازیابی نامعتبر یا منقضی شده است.'

export async function resetPassword({ token, password }) {
  const validToken = { resetTokenHash: hashToken(token), resetExpiresAt: { $gt: new Date() } }
  // Cheap check first, so invalid links do not cost a slow scrypt hash.
  if (!(await User.exists(validToken))) fail(400, INVALID_LINK)

  const passwordHash = await hashPassword(password)
  // One atomic update both consumes the token and changes the password,
  // so two parallel requests with the same link cannot both succeed.
  const user = await User.findOneAndUpdate(
    validToken,
    {
      $set: { passwordHash },
      $inc: { passwordVersion: 1 },
      $unset: { resetTokenHash: 1, resetExpiresAt: 1, resetRequestedAt: 1 }
    },
    { returnDocument: 'after' }
  ).lean()
  if (!user) fail(400, INVALID_LINK)

  // Log out every device that signed in with the old password.
  await Session.deleteMany({
    userId: user._id,
    $or: [
      { passwordVersion: { $lt: user.passwordVersion } },
      { passwordVersion: { $exists: false } }
    ]
  })
}
