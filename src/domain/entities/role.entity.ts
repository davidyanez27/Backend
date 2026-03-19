import { CustomError } from "../../application/errors";
import { UuidV4, CompanyId, UserId } from "../value-objects";
import { UUID } from '../../config';
import { RoleProps } from "../types";

const error = "Role Id is required";

/**
 * Role entity represents custom roles within a company.
 * - Each role belongs to a specific company
 * - System roles (isSystem: true) are created automatically and cannot be deleted
 * - Custom roles can be assigned to CompanyMembers for granular permissions
 */
export class RoleEntity {
    private constructor(
        public readonly id: UuidV4,
        private props: RoleProps,
    ) {
        this.ensureInvariants();
    }

    /**
     * Creates a new custom role for a company.
     */
    static createNew(props: Omit<RoleProps, "isSystem"> & { isSystem?: boolean }) {
        const id = UuidV4.from(UUID.generate());
        return new RoleEntity(id, {
            isSystem: false,
            ...props
        });
    }

    /**
     * Creates a system role (automatically created for each company).
     */
    static createSystemRole(name: string, companyId: CompanyId) {
        const id = UuidV4.from(UUID.generate());
        return new RoleEntity(id, {
            name,
            companyId,
            isSystem: true,
        });
    }

    static fromSnapshot(snapshot: { id: string; companyId: number; createdById?: number | null; updatedById?: number | null } & Omit<RoleProps, "companyId" | "createdById" | "updatedById">) {
        return new RoleEntity(UuidV4.from(snapshot.id), {
            ...snapshot,
            companyId: new CompanyId(snapshot.companyId),
            createdById: snapshot.createdById ? new UserId(snapshot.createdById) : null,
            updatedById: snapshot.updatedById ? new UserId(snapshot.updatedById) : null,
        });
    }

    rename(name: string) {
        if (this.props.isSystem) {
            throw CustomError.badRequest("Cannot rename system roles");
        }
        if (!name?.trim()) throw CustomError.badRequest("Role name is required");
        this.props.name = name.trim();
    }

    // Getters
    get name() { return this.props.name; }
    get companyId() { return this.props.companyId; }
    get isSystem() { return this.props.isSystem; }
    get createdById() { return this.props.createdById; }

    get snapshot() {
        return {
            id: this.id.value,
            name: this.props.name,
            companyId: this.props.companyId.getValue(),
            isSystem: this.props.isSystem,
            createdById: this.props.createdById?.getValue() ?? null,
            updatedById: this.props.updatedById?.getValue() ?? null,
            createdAt: this.props.createdAt,
            updatedAt: this.props.updatedAt,
        };
    }

    private ensureInvariants() {
        if (!this.props.name?.trim()) throw CustomError.badRequest("Role name is required");
        if (!this.props.companyId) throw CustomError.badRequest("Company ID is required");
    }
}
