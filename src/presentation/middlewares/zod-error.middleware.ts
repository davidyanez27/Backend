import { ZodError } from 'zod'
import type { Request, Response, NextFunction } from 'express'
import { makeProblem, zodIssuesToProblem } from '../helpers/problems'

export function zodErrorMiddleware(err: unknown, _req: Request, res: Response, next: NextFunction) {
  if (!(err instanceof ZodError)) return next(err)

  const { fields, form } = zodIssuesToProblem(err.issues)
  const pb = makeProblem({
    type: 'https://errors.yourapp.com/validation',
    title: 'Validation failed',
    status: 400,
    detail: 'Please fix the highlighted fields.',
    errors: { form, fields },
  })
  return res.status(pb.status).json(pb)
}
