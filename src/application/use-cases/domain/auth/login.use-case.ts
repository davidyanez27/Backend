import { CustomError } from '../../../errors';
import { AuthQueryRepository } from '../../../repositories';
import { LoginResponseDto } from '@inventory/shared-types';

export interface LoginUseCase {
  execute(email: string, password: string): Promise<LoginResponseDto>;
}

export class LoginUser implements LoginUseCase {
  constructor(
    private readonly repository: AuthQueryRepository,
  ) {}

  public async execute(email: string, password: string): Promise<LoginResponseDto> {
    
    const user = await this.repository.getByEmail(email, password);
    if (!user) throw CustomError.badRequest('Invalid credentials');

    if (user.user.isActive === false ) throw CustomError.forbidden('This user is deactivated, please contact your admin');


    return user;
  }
}
