import { CustomError } from "../../application/errors/customs.error";

const PENDING_DEFAULT = "PENDING";

export class CompanyIdentification {
  private constructor(
    public readonly idType: string,
    public readonly idValue: string,
  ) {}

  static pending(): CompanyIdentification {
    return new CompanyIdentification(PENDING_DEFAULT, PENDING_DEFAULT);
  }

  static create(idType: string, idValue: string): CompanyIdentification {
    if (!idType?.trim()) throw CustomError.badRequest("ID type is required");
    if (!idValue?.trim()) throw CustomError.badRequest("ID value is required");
    return new CompanyIdentification(idType.trim(), idValue.trim());
  }

  static from(idType: string, idValue: string): CompanyIdentification {
    return new CompanyIdentification(idType, idValue);
  }

  isPending(): boolean {
    return this.idType === PENDING_DEFAULT || this.idValue === PENDING_DEFAULT;
  }

  equals(other: CompanyIdentification): boolean {
    if (!(other instanceof CompanyIdentification)) return false;
    return this.idType === other.idType && this.idValue === other.idValue;
  }

  toString(): string {
    return `${this.idType}: ${this.idValue}`;
  }
}
