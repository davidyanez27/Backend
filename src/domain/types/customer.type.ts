import { CompanyId, UserId } from "../value-objects";

/**
 * Reserved system identifier type for walk-in/cash sale customers
 */
export const WALK_IN_IDENTIFIER_TYPE = "WALK_IN";

export type CustomerProps = {
    name: string;
    email: string | null;
    phone: string;
    billingAddress: string;
    shippingAddress: string;
    notes?: string | null;

    // Identifier for tax/legal purposes
    // type: Free-form string (RTN, DNI, RFC, NIT, etc.) - defined by user/company
    // identifier: The actual value
    type: string;
    identifier: string;

    // Company ownership
    companyId: CompanyId;

    // Status
    isActive: boolean;

    // Metadata
    createdById?: UserId | null;
    updatedById?: UserId | null;
    createdAt?: Date;
    updatedAt?: Date;
};

/**
 * Props for creating a walk-in/cash sale customer
 * These are created automatically per company
 */
export type WalkInCustomerProps = {
    companyId: CompanyId;
    name?: string; // Defaults to "Cliente General" / "Walk-in Customer"
};
