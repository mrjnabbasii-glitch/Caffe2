import { parseRequest, toResponse } from '../../dto/auth/me.dto.js'

export function handle(req, res) {
  parseRequest(req)
  res.json(toResponse(req.user))
}
