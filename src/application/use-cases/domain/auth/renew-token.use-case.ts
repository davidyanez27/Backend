import { LoginResponseDto, User } from '@inventory/shared-types';
import { CustomError } from '../../../errors';
import { AuthQueryRepository } from '../../../repositories';

interface RenewTokenUseCase {
    execute(id: number, companyId: number): Promise<LoginResponseDto>;
}

export class RenewToken implements RenewTokenUseCase {
  constructor(
    private readonly repository: AuthQueryRepository,
  ) {}

  public async execute(id: number, companyId: number): Promise<LoginResponseDto> {
    const user = await this.repository.getById(id, companyId);
    if (!user) throw CustomError.badRequest('Invalid credentials');
    return user;
  }
}
