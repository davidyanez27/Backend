export type AppRole = "USER" | "ADMIN";

export type UserProps = {
    email: string;
    emailValidated: boolean;
    password: string | null;
    fullName: string;
    appRole: AppRole;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
};
