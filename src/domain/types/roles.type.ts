import { CompanyId, UserId } from "../value-objects";

export type RoleProps = {
    name: string;
    companyId: CompanyId;
    isSystem: boolean;
    createdById?: UserId | null;
    updatedById?: UserId | null;
    createdAt?: Date;
    updatedAt?: Date;
};
