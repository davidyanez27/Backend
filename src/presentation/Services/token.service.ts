import { AuthClaims } from "@inventory/shared-types";
import { Jwt } from "../../config";
import { CustomError } from "../../application/errors";

export class TokenService {
  async CreateToken(user: AuthClaims): Promise<string> {
    const { sub, rid, org, ver } = user;

    const token = await Jwt.generateToken({sub, rid, org, ver });
    if (!token) throw CustomError.internalServer("Error while creating JWT");

    return token;
  }
}
