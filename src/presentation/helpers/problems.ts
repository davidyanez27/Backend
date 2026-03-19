import { Prisma } from "@prisma/client"
import {z} from "zod"

export type Problem = {
  type: string
  title: string
  status: number
  detail?: string
  errors?: {
    form?: string[]
    fields?: Record<string, string[]>
  }
}

const FIELD_LABELS: Record<string, string> = {
  name: 'name',
  serie: 'Serie',
}

const CONSTRAINT_TO_FIELDS: Record<string, string[]> = {
  uniq_product_name_per_user: ['name'],
  uniq_product_serie_per_user: ['serie'],
}
const TENANT_KEYS = new Set([
  'user_id', 'owner_id', 'tenant_id', 'company_id', 'org_id', 'account_id',
])

const asArray = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : [])


export const makeProblem = (p: Partial<Problem> & Pick<Problem, 'title' | 'status'>): Problem => {
  const base: Problem = {
    type: p.type ?? 'https://errors.yourapp.com/problem',
    title: p.title,
    status: p.status,
    ...(p.detail && { detail: p.detail }),
  };

  // Only attach `errors` if provided
  if (p.errors) {
    return {
      ...base,
      errors: {
        form: p.errors.form ?? [],
        fields: p.errors.fields ?? {},
      },
    };
  }

  return base;
}
export const friendlyField = (f: string) => FIELD_LABELS[f] ?? f

export const extractUiFieldsFromP2002 = (err: Prisma.PrismaClientKnownRequestError): string[] =>{
  const metaTarget = (err.meta as any)?.target

  // 1) Constraint name path (if string and mapped)
  if (typeof metaTarget === 'string') {
    const mapped = CONSTRAINT_TO_FIELDS[metaTarget]
    if (mapped?.length) return mapped
  }

  // 2) Fields from meta.target (array)
  let fields = asArray<string>(metaTarget)

  // 3) Fallback: try parsing field list from message
  if (!fields.length) {
    fields =
      err.message
        .match(/\((.*?)\)/)?.[1]
        ?.split(',')
        .map((s) => s.replace(/[`"]/g, '').trim()) ?? []
  }

  // 4) Hide tenant keys; ensure we return at least one field
  const visible = fields.filter((f) => !TENANT_KEYS.has(f))
  if (visible.length) return visible

  const firstNonTenant = fields.find((f) => !TENANT_KEYS.has(f))
  return [firstNonTenant ?? fields[0] ?? 'unknown']
}

export const zodIssuesToProblem = (issues: z.core.$ZodIssue[]) => {
  const fields: Record<string, string[]> = {}
  const form: string[] = []
  for (const issue of issues) {
    const key = issue.path.length ? issue.path.join('.') : ''
    if (key) (fields[key] ??= []).push(issue.message)
    else form.push(issue.message)
  }
  return { fields, form }
}