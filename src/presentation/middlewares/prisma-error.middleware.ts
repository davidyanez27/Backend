
import { Prisma } from '@prisma/client'
import type { Request, Response, NextFunction } from 'express'
import { makeProblem, friendlyField, extractUiFieldsFromP2002 } from '../helpers/problems'

export function prismaErrorMiddleware(err: unknown, req: Request, res: Response, next: NextFunction) {

  if (!(err instanceof Prisma.PrismaClientKnownRequestError)) return next(err)
    
  let pb
  switch (err.code) {
    case 'P2002': {
      const uiFields = extractUiFieldsFromP2002(err)
      const human = uiFields.map(friendlyField).join(' + ')
      pb = makeProblem({
        type: 'https://errors.yourapp.com/conflict/unique',
        title: 'Duplicate value',
        status: 409,
        detail: `${human} is already used in your account.`,
        errors: { fields: Object.fromEntries(uiFields.map(f => [f, ['Already in use. Try a different value.']])) }
      })
      break
    }
    case 'P2003': {
      const field = String((err.meta as any)?.field ?? 'related id')
      if (req.method === 'DELETE') {
        pb = makeProblem({
          type: 'https://errors.yourapp.com/conflict/in-use',
          title: 'Record in use',
          status: 409,
          detail: 'This record cannot be deleted because it has related data (e.g. invoices, projects).',
        })
      } else {
        pb = makeProblem({
          type: 'https://errors.yourapp.com/conflict/foreign-key',
          title: 'Related record missing',
          status: 409,
          detail: `The provided ${friendlyField(field)} does not exist.`,
          errors: { fields: { [field]: ['Select an existing value.'] } },
        })
      }
      break
    }

    case 'P2025': {
      const field = getMissingModelFromCause(err);
      const cause = String((err.meta as any)?.cause ?? '')
      if (cause.includes('No \'User\' record(s)')) {
        pb = makeProblem({
          type: 'https://errors.yourapp.com/auth/invalid',
          title: 'Invalid user',
          status: 401,
          detail: 'Invalid user context. Please log in again.',
        })
      } else {
        pb = makeProblem({
          type: 'https://errors.yourapp.com/not-found',
          title: field != null ? `${field} not found` : `Record not found`,
          status: 404,
          detail: 'The requested record could not be found.',
        })
      }
      break
    }
    default:
      pb = makeProblem({
        type: 'https://errors.yourapp.com/database',
        title: 'Database error',
        status: 500,
        detail: 'Something went wrong while saving. Please try again.',
      })
  }

  console.error({ path: req.path, method: req.method, prisma: err.code, meta: err.meta, message: err.message })
  return res.status(pb.status).json(pb)
}

function getMissingModelFromCause(err: any): string | null {
  const cause = String(err?.meta?.cause ?? '');
  const match = cause.match(/No '(.+?)' record\(s\)/); // captures Role/User/etc
  return match?.[1] ?? null;
}
