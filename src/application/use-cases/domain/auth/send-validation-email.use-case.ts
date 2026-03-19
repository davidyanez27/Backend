import { Jwt } from "../../../../config";
import { EmailService } from "../../../../presentation/Services";
import { CustomError } from "../../../errors";

interface SendValidationEmailUseCase {
    execute(email:string, userId: string, companyId: string): Promise<boolean>
}

export class SendValidationEmail implements SendValidationEmailUseCase{
    constructor (
        private readonly emailService: EmailService,
        private readonly WEBSERVICE_URL: String
    ) {}
    
    async execute(email:string, userId: string, companyId: string): Promise<boolean> {
        const token = await Jwt.generateToken({userId, email, companyId}, '1d');
        if (!token) throw CustomError.internalServer('Error getting token');

        const link = `${ this.WEBSERVICE_URL }/auth/validate-email/${token}`;
        const html = `
            <h1>Validate your Email</h1>
            <p>Please click on the following link to validate your email</p>
            <a href="${ link }">Validate your email: ${ email }</a>

        `
        const options = {
            to: email, 
            subject: 'Validate your email',
            htmlBody: html,
        }

        const isSet = await this.emailService.sendEmail(options);
        if (!isSet) throw CustomError.internalServer('Error sending email');
        return true

    }

}