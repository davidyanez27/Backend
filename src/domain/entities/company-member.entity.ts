import { CustomError } from "../../application/errors";
import { UuidV4, CompanyId, UserId, CompanyRole } from "../value-objects";
import { UUID } from '../../config';
import { CompanyMemberProps } from "../types";

const error = "CompanyMember Id is required";

export class CompanyMemberEntity {
    private constructor(
        public readonly id: UuidV4,
        private props: CompanyMemberProps,
    ) {
        this.ensureInvariants();
    }

    static createNew(props: Omit<CompanyMemberProps, "isActive"> & { isActive?: boolean }) {
        const id = UuidV4.from(UUID.generate());
        return new CompanyMemberEntity(id, {
            isActive: true,
            ...props
        });
    }

    static createOwner(companyId: number, userId: number) {
        return CompanyMemberEntity.createNew({
            companyId: new CompanyId(companyId),
            userId: new UserId(userId),
            companyRole: CompanyRole.OWNER(),
            roleId: null,
            isActive: true,
        });
    }

    static createMember(companyId: number, userId: number, roleId?: number | null) {
        return CompanyMemberEntity.createNew({
            companyId: new CompanyId(companyId),
            userId: new UserId(userId),
            companyRole: CompanyRole.MEMBER(),
            roleId: roleId ?? null,
            isActive: true,
        });
    }

    static fromSnapshot(snapshot: { id: string; companyId: number; userId: number; companyRole: string; roleId: number | null; isActive: boolean; createdAt?: Date; updatedAt?: Date }) {
        return new CompanyMemberEntity(UuidV4.from(snapshot.id), {
            companyId: new CompanyId(snapshot.companyId),
            userId: new UserId(snapshot.userId),
            companyRole: CompanyRole.from(snapshot.companyRole),
            roleId: snapshot.roleId,
            isActive: snapshot.isActive,
            createdAt: snapshot.createdAt,
            updatedAt: snapshot.updatedAt,
        });
    }

    changeRole(role: CompanyRole) {
        this.props.companyRole = role;
    }

    assignCustomRole(roleId: number) {
        this.props.roleId = roleId;
    }

    removeCustomRole() {
        this.props.roleId = null;
    }

    deactivate() { this.props.isActive = false; }
    activate() { this.props.isActive = true; }

    // Getters
    get companyId() { return this.props.companyId; }
    get userId() { return this.props.userId; }
    get companyRole() { return this.props.companyRole; }
    get roleId() { return this.props.roleId; }
    get isActive() { return this.props.isActive; }
    get isOwner() { return this.props.companyRole.isOwner(); }
    get isAdmin() { return this.props.companyRole.hasAdminPrivileges(); }

    get snapshot() {
        return {
            id: this.id.value,
            companyId: this.props.companyId.getValue(),
            userId: this.props.userId.getValue(),
            companyRole: this.props.companyRole.value,
            roleId: this.props.roleId,
            isActive: this.props.isActive,
            createdAt: this.props.createdAt,
            updatedAt: this.props.updatedAt,
        };
    }

    private ensureInvariants() {
        if (!this.props.companyRole) throw CustomError.badRequest("Company role is required");
    }
}
