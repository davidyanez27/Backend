import type { Request, Response, NextFunction } from 'express'
import { makeProblem } from '../helpers/problems'
import { CustomError } from '../../application/errors/customs.error';

export function customErrorMiddleware(err: unknown, _req: Request, res: Response, next: NextFunction) {
  if (!(err instanceof CustomError)) return next(err)

  const status = err.statusCode ?? 500;

  const problem = makeProblem({
    type: 'https://errors.yourapp.com/domain-error',
    title: 'Request failed',
    status,
    detail: err.message,
    // Only include extra details if you store them on the error

  });

  return res.status(problem.status).json(problem);
}



// export function customErrorMiddleware( err: unknown, _req: Request, res: Response, _next: NextFunction) {
//   if (err instanceof CustomError) {
//     const status = err.statusCode ?? 500;

//     const problem = makeProblem({
//       type: 'https://errors.yourapp.com/domain-error',
//       title: 'Request failed',
//       status,
//       detail: err.message,
//     });

//     return res.status(problem.status).json(problem);
//   }

//   // Fallback for any other error (like ENOENT from pdfmake)
//   console.error(err);
//   const message = err instanceof Error ? err.message : 'Unexpected error';

//   const problem = makeProblem({
//     type: 'https://errors.yourapp.com/internal-error',
//     title: 'Internal Server Error',
//     status: 500,
//     detail: message,
//   });

//   return res.status(500).json(problem);
// }