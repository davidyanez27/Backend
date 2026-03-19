import type { Request, Response, NextFunction } from 'express';
import { makeProblem } from '../helpers/problems';

export function notFoundErrrorMiddleware(req: Request, res: Response, _next: NextFunction) {
  const response = makeProblem({
    type: 'https://errors.yourapp.com/database',
    title: 'Not Found',
    status: 404,
    detail: `Cannot ${req.method} ${req.originalUrl}`,
  })
  return res.status(404).json(response);
}


export function serverErrorMiddleware(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.error(err);
  const message = err instanceof Error ? err.message : 'Unexpected error';
  const response = makeProblem({
    type: 'https://errors.yourapp.com/internal-error',
    title: 'Internal Server Error',
    status: 500,
    detail: message,
  })
  return res.status(500).json(response);
}


