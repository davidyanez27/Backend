import { CustomError } from "../../application/errors/customs.error";

export class CustomerId {
  constructor(
    private value: number,
    public error: string = "Invalid CustomerId",
  ) {
    if (value <= 0) throw CustomError.badRequest(error);
  }

  getValue(): number {
    return this.value;
  }
}
