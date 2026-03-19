import { CustomError } from "../../application/errors";
import { UuidV4, CompanyIdentification, StripeCustomerId } from "../value-objects";
import { regularExps, UUID } from '../../config';
import { CompanyProps, CompanyType } from "../types";


const error = "Company Id is required";

// Default values for incomplete company profiles (user can update later)
const PENDING_DEFAULT = "PENDING";

export class CompanyEntity {
    private constructor(
        public readonly id: UuidV4,
        private props: CompanyProps,
    ) {
        this.ensureInvariants();
    }

    /**
     * Creates a new company with minimal required fields.
     * Used during user registration - company profile can be completed later.
     */
    static createNew(props: {
        name: string;
        email: string;
        country: string;
        currency: string;
        companyType?: CompanyType;
        identification?: CompanyIdentification;
        phone?: string;
        address?: string;
        isActive?: boolean;
    }) {
        const id = UuidV4.from(UUID.generate());
        return new CompanyEntity(id, {
            name: props.name,
            email: props.email,
            country: props.country,
            currency: props.currency,
            companyType: props.companyType ?? "INDIVIDUAL",
            identification: props.identification ?? CompanyIdentification.pending(),
            phone: props.phone ?? PENDING_DEFAULT,
            address: props.address ?? PENDING_DEFAULT,
            isActive: props.isActive ?? true,
        });
    }

    static fromSnapshot(snapshot: { id: string; idType: string; idValue: string; logo?: string | null; stripeCustomerId?: string | null } & Omit<CompanyProps, "identification" | "stripeCustomerId" | "logo">) {
        return new CompanyEntity(UuidV4.from(snapshot.id), {
            ...snapshot,
            logo: snapshot.logo ?? null,
            identification: CompanyIdentification.from(snapshot.idType, snapshot.idValue),
            stripeCustomerId: snapshot.stripeCustomerId ? StripeCustomerId.from(snapshot.stripeCustomerId) : null,
        });
    }

    // Update methods for "my company" page
    rename(name: string) {
        if (!name?.trim()) throw CustomError.badRequest("Name is required");
        this.props.name = name.trim();
    }

    changeCompanyType(type: CompanyType) {
        this.props.companyType = type;
    }

    changeIdentification(idType: string, idValue: string) {
        this.props.identification = CompanyIdentification.create(idType, idValue);
    }

    changeAddress(address: string) {
        if (!address?.trim()) throw CustomError.badRequest("Address is required");
        this.props.address = address.trim();
    }

    changeEmail(email: string) {
        if (!email?.trim()) throw CustomError.badRequest("Email is required");
        const newEmail = email.trim();
        if (!regularExps.email.test(newEmail)) {
            throw CustomError.badRequest("Invalid email format, please provide a valid email address");
        }
        this.props.email = newEmail;
    }

    changePhone(phone: string) {
        if (!phone?.trim()) throw CustomError.badRequest("Phone is required");
        this.props.phone = phone.trim();
    }

    changeCountry(country: string, currency: string) {
        if (!country?.trim()) throw CustomError.badRequest("Country is required");
        if (!currency?.trim()) throw CustomError.badRequest("Currency is required");
        this.props.country = country.trim();
        this.props.currency = currency.trim();
    }

    changeLogo(logo: string | null) {
        this.props.logo = logo;
    }

    setStripeCustomerId(stripeCustomerId: string) {
        this.props.stripeCustomerId = StripeCustomerId.create(stripeCustomerId);
    }

    deactivate() { this.props.isActive = false; }
    activate() { this.props.isActive = true; }

    // Getters
    get name() { return this.props.name; }
    get email() { return this.props.email; }
    get companyType() { return this.props.companyType; }
    get identification() { return this.props.identification; }
    get country() { return this.props.country; }
    get currency() { return this.props.currency; }
    get isActive() { return this.props.isActive; }
    get isProfileComplete() {
        return this.props.phone !== PENDING_DEFAULT &&
               this.props.address !== PENDING_DEFAULT &&
               !this.props.identification.isPending();
    }

    get snapshot() {
        return {
            id: this.id.value,
            name: this.props.name,
            companyType: this.props.companyType,
            idType: this.props.identification.idType,
            idValue: this.props.identification.idValue,
            email: this.props.email,
            phone: this.props.phone,
            address: this.props.address,
            country: this.props.country,
            currency: this.props.currency,
            logo: this.props.logo ?? null,
            stripeCustomerId: this.props.stripeCustomerId?.value ?? null,
            isActive: this.props.isActive,
            createdAt: this.props.createdAt,
            updatedAt: this.props.updatedAt,
        };
    }

    private ensureInvariants() {
        // Only validate truly required fields for company creation
        if (!this.props.name?.trim()) throw CustomError.badRequest("Company name is required");
        if (!this.props.email?.trim()) throw CustomError.badRequest("Email is required");
        if (!regularExps.email.test(this.props.email.trim())) {
            throw CustomError.badRequest("Invalid email format, please provide a valid email address");
        }
        if (!this.props.country?.trim()) throw CustomError.badRequest("Country is required");
        if (!this.props.currency?.trim()) throw CustomError.badRequest("Currency is required");
    }
}
