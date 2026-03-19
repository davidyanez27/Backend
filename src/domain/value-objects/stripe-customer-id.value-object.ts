import { CustomError } from "../../application/errors/customs.error";

export class StripeCustomerId {
  readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): StripeCustomerId {
    if (!value?.trim()) throw CustomError.badRequest("Stripe Customer ID is required");
    if (!value.startsWith("cus_")) throw CustomError.badRequest("Invalid Stripe Customer ID format");
    return new StripeCustomerId(value.trim());
  }

  static from(value: string): StripeCustomerId {
    return new StripeCustomerId(value);
  }

  equals(other: StripeCustomerId): boolean {
    if (!(other instanceof StripeCustomerId)) return false;
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
