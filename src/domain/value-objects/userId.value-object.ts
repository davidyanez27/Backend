import { CustomError } from "../../application/errors/customs.error";

export class UserId {
  constructor(
    private value: number,
    public error: string = "Invalid UserId",
  ) {
    if (value <= 0) throw CustomError.badRequest(error);
  }


  getValue(): number {
    return this.value;
  }
}
