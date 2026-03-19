import { CustomError } from "../../application/errors/customs.error";

export class InvoiceId {
  constructor(
    private value: number,
    public error: string = "Invalid InvoiceId",
  ) {
    if (value <= 0) throw CustomError.badRequest(error);
  }

  getValue(): number {
    return this.value;
  }
}
