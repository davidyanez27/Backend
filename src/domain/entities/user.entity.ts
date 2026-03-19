import { CustomError } from "../../application/errors";
import { UuidV4 } from "../value-objects";
import { regularExps, UUID } from '../../config';
import { UserProps, AppRole } from "../types";


const error = "User Id is required";

export class UserEntity {
    private constructor(
        public readonly id: UuidV4,
        private props: UserProps,
    ) {
        this.ensureInvariants();
    }

    static createNew(props: Omit<UserProps, "isActive" | "emailValidated" | "appRole"> & {
        isActive?: boolean;
        emailValidated?: boolean;
        appRole?: AppRole;
    }) {
        const id = UuidV4.from(UUID.generate());
        return new UserEntity(id, {
            isActive: true,
            emailValidated: false,
            appRole: "USER",
            ...props
        });
    }

    static fromSnapshot(snapshot: { id: string } & UserProps) {
        return new UserEntity(UuidV4.from(snapshot.id), snapshot);
    }

    rename(name: string) {
        if (!name?.trim()) throw CustomError.badRequest("Full Name is required");
        this.props.fullName = name.trim();
    }

    changePassword(password: string) {
        if (!password?.trim()) throw CustomError.badRequest("Password is required");
        this.props.password = password.trim();
    }

    validateEmail() {
        this.props.emailValidated = true;
    }

    invalidateEmail() {
        this.props.emailValidated = false;
    }

    changeAppRole(role: AppRole) {
        this.props.appRole = role;
    }

    deactivate() { this.props.isActive = false; }
    activate() { this.props.isActive = true; }

    get email() { return this.props.email; }
    get fullName() { return this.props.fullName; }
    get isActive() { return this.props.isActive; }
    get emailValidated() { return this.props.emailValidated; }
    get appRole() { return this.props.appRole; }

    get snapshot() {
        return { id: this.id.value, ...this.props };
    }

    private ensureInvariants() {
        if (!this.props.email?.trim()) throw CustomError.badRequest("Email is required");
        if (this.props.email && !regularExps.email.test(this.props.email.trim())) {
            throw CustomError.badRequest("Invalid email format, please provide a valid email address");
        }
        if (!this.props.fullName?.trim()) throw CustomError.badRequest("Full Name is required");
    }
}
