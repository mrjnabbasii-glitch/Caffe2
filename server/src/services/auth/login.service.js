import { User } from '../../models/user.model.js'
import { hashPassword, verifyPassword } from '../../utils/password.js'
import { fail } from '../../utils/http-error.js'

const dummyHash = hashPassword('dummy-password-for-timing')
export async function login({ email, username, password }) {
  const user = await User.findOne(email ? { email } : { username }).select('+passwordHash')
  const valid = await verifyPassword(password, user?.passwordHash || (await dummyHash))
  if (!user || !valid) fail(401, 'نام کاربری، ایمیل یا رمز عبور اشتباه است.')
  return user
}
