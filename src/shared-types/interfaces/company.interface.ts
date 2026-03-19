import { BasePagination } from "./pagination.interfaces"

export interface Company {
readonly name: string
readonly rtn: string
readonly address: string
readonly phone: string
readonly email: string
readonly userId?: string

}

export interface UpdateCompanyRequestPayload {
  name?: string;
  rtn?: string;
  address?: string;
  phone?: string;
  email?: string;
  userId?: number;

}

export interface ListCompanyResponse extends BasePagination {
  users: Company[];
}