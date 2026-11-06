import type { Request } from 'express'
import { Transform } from 'class-transformer'
import { IsString, Length } from 'class-validator'
import { lowerText, validateDto } from '../shared/validation.js'
import { emailInput } from '../shared/email.dto.js'
import { usernameInput } from '../shared/username.dto.js'
import { publicUser } from '../shared/user.dto.js'
import type { UserSource, AuthResponse } from '../shared/contracts.js'

export class LoginRequestDto {
  @Transform(lowerText)
  @IsString({ message: 'نام کاربری یا ایمیل باید متن باشد.' })
  @Length(3, 254, { message: 'نام کاربری یا ایمیل معتبر وارد کنید.' })
  identifier!: string
  @IsString({ message: 'رمز عبور باید متن باشد.' })
  @Length(8, 128, { message: 'رمز عبور باید بین ۸ تا ۱۲۸ نویسه باشد.' })
  password!: string
}
export interface LoginInput {
  email?: string
  username?: string
  password: string
}
export function parseRequest(req: Request): LoginInput {
  const input = validateDto(LoginRequestDto, {
    identifier: req.body?.identifier !== undefined ? req.body.identifier : req.body?.email,
    password: req.body?.password
  })
  return {
    ...(input.identifier.includes('@')
      ? { email: emailInput(input.identifier) }
      : { username: usernameInput(input.identifier) }),
    password: input.password
  }
}
export function toResponse(user: UserSource): AuthResponse {
  return { user: publicUser(user) }
}
