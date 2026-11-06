import type { Request } from 'express'
import { publicUser } from '../shared/user.dto.js'
import type { UserSource, AuthResponse } from '../shared/contracts.js'

export class MeRequestDto {}
export function parseRequest(_req: Request): MeRequestDto {
  return new MeRequestDto()
}
export function toResponse(user: UserSource): AuthResponse {
  return { user: publicUser(user) }
}
