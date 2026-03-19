import { Jwt } from "../../../../config"
import { CustomError } from "../../../errors/customs.error"
import { AuthRepository } from '../../../../domain/repositories';

interface ValidateEmailUseCase {
    execute( token: string ):Promise<string>
}

export class ValidateEmail implements ValidateEmailUseCase{
    constructor (
        private readonly repository: AuthRepository,
    ){}
    async execute(token: string): Promise<string> {
        const payload = await Jwt.validateToken(token)
        if ( !payload ) throw CustomError.unauthorized("Invalid token")

        const { email } = payload as { email:string };
        if( !email ) throw CustomError.internalServer("Email not in token")

        await this.repository.validateUser(email);

        return "Your email has been successfully verified!"
    }
}
