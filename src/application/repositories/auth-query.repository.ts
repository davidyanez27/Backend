import { AuthIdentity, LoginResponseDto } from "@inventory/shared-types";

export abstract class AuthQueryRepository {
    abstract getById (id: number, companyId: number): Promise<LoginResponseDto | null>;
    abstract getByEmail(email: string, password: string): Promise<LoginResponseDto | null>;
    abstract resolveIdentity(sub: string, org: string): Promise<AuthIdentity | null>;
}

