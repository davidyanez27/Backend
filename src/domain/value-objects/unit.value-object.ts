import { CustomError } from "../../application/errors/customs.error";

export class Unit {
  private static readonly VALID_UNITS = ['UNIT', 'KG', 'HOUR', 'METER', 'LITER', 'BOX', 'PIECE'] as const;

  readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static UNIT(): Unit {
    return new Unit('UNIT');
  }

  static KG(): Unit {
    return new Unit('KG');
  }

  static HOUR(): Unit {
    return new Unit('HOUR');
  }

  static from(value: string): Unit {
    const upperValue = value.toUpperCase();

    if (!this.isValid(upperValue)) {
      throw CustomError.badRequest(`Invalid unit: ${value}. Valid units are: ${this.VALID_UNITS.join(', ')}`);
    }

    return new Unit(upperValue);
  }

  private static isValid(value: string): boolean {
    return this.VALID_UNITS.includes(value as any);
  }

  equals(other: Unit): boolean {
    if (!(other instanceof Unit)) return false;
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
