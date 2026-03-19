import { CompanyIdentification, StripeCustomerId } from "../value-objects";

export type CompanyType = "INDIVIDUAL" | "BUSINESS" | "ENTERPRISE";

export type CompanyProps = {
    name: string;
    companyType: CompanyType;
    identification: CompanyIdentification;
    email: string;
    phone: string;
    address: string;
    country: string;
    currency: string;
    logo?: string | null;
    stripeCustomerId?: StripeCustomerId | null;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
};
