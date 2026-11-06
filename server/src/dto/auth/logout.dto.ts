import type { Request } from 'express'

export class LogoutRequestDto {}
export function parseRequest(_req: Request): LogoutRequestDto {
  return new LogoutRequestDto()
}
export function toResponse(): void {}
