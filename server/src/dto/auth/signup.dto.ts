import type { Request } from 'express'
import { Transform } from 'class-transformer'
import { IsString, Matches } from 'class-validator'
import { CredentialsDto } from '../shared/credentials.dto.js'
import { usernameText, validateDto } from '../shared/validation.js'
import { publicUser } from '../shared/user.dto.js'
import type { UserSource, AuthResponse } from '../shared/contracts.js'

export class SignupRequestDto extends CredentialsDto {
  @Transform(usernameText)
  @IsString({ message: 'نام کاربری باید متن باشد.' })
  @Matches(/^\p{L}[\p{L}\p{N}_]{2,29}$/u, {
    message: 'نام کاربری باید ۳ تا ۳۰ حرف، عدد یا زیرخط باشد و با حرف شروع شود.'
  })
  username!: string
}
export function parseRequest(req: Request): SignupRequestDto {
  return validateDto(SignupRequestDto, req.body)
}
export function toResponse(user: UserSource): AuthResponse {
  return { user: publicUser(user) }
}
