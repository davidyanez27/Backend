import { CustomError } from "../../application/errors/customs.error";

export class CompanyId {
  constructor(
    private value: number,
    public error: string = "Invalid CompanyId",
  ) {
    if (value <= 0) throw CustomError.badRequest(error);
  }


  getValue(): number {
    return this.value;
  }
}
