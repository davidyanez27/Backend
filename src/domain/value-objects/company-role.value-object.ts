import { CustomError } from '../../application/errors/customs.error';
export class CompanyRole {
  private static readonly VALID_ROLES = ['OWNER', 'ADMIN', 'MEMBER'] as const;
  
  readonly value: 'OWNER' | 'ADMIN' | 'MEMBER';

  private constructor(value: 'OWNER' | 'ADMIN' | 'MEMBER') {
    this.value = value;
  }

  static OWNER(): CompanyRole {
    return new CompanyRole('OWNER');
  }

  static ADMIN(): CompanyRole {
    return new CompanyRole('ADMIN');
  }

  static MEMBER(): CompanyRole {
    return new CompanyRole('MEMBER');
  }

  static from(value: string): CompanyRole {
    const upperValue = value.toUpperCase();
    
    if (!this.isValid(upperValue)) {
      throw CustomError.badRequest(`Invalid company role: ${value}. Valid roles are: OWNER, ADMIN, MEMBER`);
    }

    return new CompanyRole(upperValue as 'OWNER' | 'ADMIN' | 'MEMBER');
  }

  private static isValid(value: string): boolean {
    return this.VALID_ROLES.includes(value as any);
  }

  isOwner(): boolean {
    return this.value === 'OWNER';
  }

  isAdmin(): boolean {
    return this.value === 'ADMIN';
  }

  isMember(): boolean {
    return this.value === 'MEMBER';
  }

  hasAdminPrivileges(): boolean {
    return this.value === 'OWNER' || this.value === 'ADMIN';
  }

  canManageMembers(): boolean {
    return this.hasAdminPrivileges();
  }

  canDeleteCompany(): boolean {
    return this.isOwner();
  }

  equals(other: CompanyRole): boolean {
    if (!(other instanceof CompanyRole)) {
      return false;
    }
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
