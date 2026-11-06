import type { Request } from 'express'
import { EmailValueDto } from '../shared/email.dto.js'
import { validateDto } from '../shared/validation.js'

export class ForgotPasswordRequestDto extends EmailValueDto {}
export function parseRequest(req: Request): ForgotPasswordRequestDto {
  return validateDto(ForgotPasswordRequestDto, req.body)
}
export function toResponse(): { message: string } {
  return {
    message: 'اگر حسابی با این ایمیل وجود داشته باشد، راهنمای بازیابی رمز برای آن ارسال می‌شود.'
  }
}
