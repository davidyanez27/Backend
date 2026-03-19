import { BasePagination } from "./pagination.interfaces"

export interface User {
readonly username: string
readonly uuid: string
readonly email: string
readonly firstName: string
readonly lastName: string
readonly role: number | string
readonly isActive: boolean
readonly createdAt?: string
}

export interface UpdateUserRequestPayload {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  roleId?: number;
  parentUserId?: number;
  organizationId?: number;
  IsActive?: boolean;
}

export interface ListUsersResponse extends BasePagination {
  users: User[];
}