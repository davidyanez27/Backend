import { CustomError } from "../../application/errors/customs.error";

export class ItemType {
  private static readonly VALID_TYPES = ['PRODUCT', 'SERVICE'] as const;

  readonly value: 'PRODUCT' | 'SERVICE';

  private constructor(value: 'PRODUCT' | 'SERVICE') {
    this.value = value;
  }

  static PRODUCT(): ItemType {
    return new ItemType('PRODUCT');
  }

  static SERVICE(): ItemType {
    return new ItemType('SERVICE');
  }

  static from(value: string): ItemType {
    const upperValue = value.toUpperCase();

    if (!this.isValid(upperValue)) {
      throw CustomError.badRequest(`Invalid item type: ${value}. Valid types are: PRODUCT, SERVICE`);
    }

    return new ItemType(upperValue as 'PRODUCT' | 'SERVICE');
  }

  private static isValid(value: string): boolean {
    return this.VALID_TYPES.includes(value as any);
  }

  isProduct(): boolean {
    return this.value === 'PRODUCT';
  }

  isService(): boolean {
    return this.value === 'SERVICE';
  }

  equals(other: ItemType): boolean {
    if (!(other instanceof ItemType)) return false;
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
