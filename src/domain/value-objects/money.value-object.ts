import { CustomError } from "../../application/errors";

export class Money {
  private constructor(
    public readonly amount: number , 
    public readonly currency: string
  ) {}
  static create(amount: number, currency = "USD") {
    if (amount < 0) throw CustomError.badRequest("Negative amount not allowed");
    if (!currency) throw CustomError.badRequest("Currency is required");
    const number = Number( amount.toFixed(2))
    return new Money(number, currency);
  }

  static format(amount: number, currency: string) {
    return `${amount.toFixed(2)} ${currency}`
  }

}
