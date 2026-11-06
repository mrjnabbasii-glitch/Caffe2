import type { Request } from 'express'
import { Transform } from 'class-transformer'
import { IsString, Matches } from 'class-validator'
import { PasswordValueDto } from '../shared/password.dto.js'
import { trimText, validateDto } from '../shared/validation.js'

export class ResetPasswordRequestDto extends PasswordValueDto {
  @Transform(trimText)
  @IsString({ message: 'لینک بازیابی نامعتبر است.' })
  @Matches(/^[a-f0-9]{64}$/, { message: 'لینک بازیابی نامعتبر یا منقضی شده است.' })
  token!: string
}
export function parseRequest(req: Request): ResetPasswordRequestDto {
  return validateDto(ResetPasswordRequestDto, req.body)
}
export function toResponse(): { message: string } {
  return { message: 'رمز عبور تغییر کرد. با رمز جدید وارد شوید.' }
}
