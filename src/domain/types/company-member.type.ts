import { CompanyId, UserId } from "../value-objects";
import { CompanyRole } from "../value-objects";

export type CompanyMemberProps = {
    companyId: CompanyId;
    userId: UserId;
    companyRole: CompanyRole;
    roleId: number | null;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
};
