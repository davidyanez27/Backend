import { UUID } from '../../config/uuid.adapter';
import { CustomError } from '../../application/errors/customs.error';

export class UuidV4 {
  readonly value: string;

  private constructor(value: string) {
    if (!UuidV4.isValid(value)) throw CustomError.badRequest("Invalid UUID format");
    this.value = value;
  }

  static create(): UuidV4 {
    const uuid = UUID.generate();
    return new UuidV4(uuid);
  }

  static from(value: string): UuidV4 {
    return new UuidV4(value);
  }

  private static isValid(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  equals(other: UuidV4): boolean {
    if (!(other instanceof UuidV4)) {
      return false;
    }
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

export class InvalidUuidError extends Error {
  constructor(value: string) {
    super(`Invalid UUID format: ${value}`);
    this.name = 'InvalidUuidError';
  }
}