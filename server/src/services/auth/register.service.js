import { User } from '../../models/user.model.js'
import { hashPassword } from '../../utils/password.js'
import { fail } from '../../utils/http-error.js'

export async function register({ username, email, password }) {
  if (await User.exists({ email })) fail(409, 'این ایمیل قبلاً ثبت شده است.')
  if (await User.exists({ username })) fail(409, 'این نام کاربری قبلاً انتخاب شده است.')
  return User.create({
    name: username,
    username,
    email,
    passwordHash: await hashPassword(password)
  })
}
