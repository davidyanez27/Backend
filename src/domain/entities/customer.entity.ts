import { CustomError } from "../../application/errors";
import { UuidV4, CompanyId, UserId } from "../value-objects";
import { regularExps, UUID } from '../../config';
import { CustomerProps, WalkInCustomerProps, WALK_IN_IDENTIFIER_TYPE } from "../types";

const error = "Customer Id is required";

/**
 * CustomerEntity represents a customer/client of a company.
 *
 * Supports different customer types:
 * - Regular customers with tax IDs (RTN, DNI, RFC, NIT, etc.)
 * - Walk-in/Cash Sale customers for quick transactions
 */
export class CustomerEntity {
  private constructor(
    public readonly id: UuidV4,
    private props: CustomerProps,
  ) {
    this.ensureInvariants();
  }

  /**
   * Creates a regular customer with full details
   */
  static createNew(props: Omit<CustomerProps, "isActive"> & { isActive?: boolean }) {
    const id = UuidV4.from(UUID.generate());
    return new CustomerEntity(id, {
      isActive: true,
      ...props
    });
  }

  /**
   * Creates a "Walk-in" / "Cash Sale" customer for quick invoices.
   */
  static createWalkIn(props: WalkInCustomerProps) {
    const id = UuidV4.from(UUID.generate());
    return new CustomerEntity(id, {
      name: props.name ?? "Cliente General",
      email: null,
      phone: "N/A",
      billingAddress: "N/A",
      shippingAddress: "N/A",
      notes: "System-generated walk-in customer for cash sales",
      type: WALK_IN_IDENTIFIER_TYPE,
      identifier: "WALK-IN",
      companyId: props.companyId,
      isActive: true,
    });
  }

  static fromSnapshot(snapshot: { id: string; companyId: number; createdById?: number | null; updatedById?: number | null } & Omit<CustomerProps, "companyId" | "createdById" | "updatedById">) {
    return new CustomerEntity(UuidV4.from(snapshot.id), {
      ...snapshot,
      companyId: new CompanyId(snapshot.companyId),
      createdById: snapshot.createdById ? new UserId(snapshot.createdById) : null,
      updatedById: snapshot.updatedById ? new UserId(snapshot.updatedById) : null,
    });
  }

  // ─────────────────── Mutation Methods ───────────────────

  changeName(name: string) {
    if (!name?.trim()) throw CustomError.badRequest("Name is required");
    this.props.name = name.trim();
  }

  changeBillingAddress(billingAddress: string) {
    if (!billingAddress?.trim()) throw CustomError.badRequest("Billing address is required");
    this.props.billingAddress = billingAddress.trim();
  }

  changeShippingAddress(shippingAddress: string) {
    if (!shippingAddress?.trim()) throw CustomError.badRequest("Shipping address is required");
    this.props.shippingAddress = shippingAddress.trim();
  }

  changeEmail(email: string | null) {
    if (email && !regularExps.email.test(email.trim())) {
      throw CustomError.badRequest("Invalid email format");
    }
    this.props.email = email?.trim() ?? null;
  }

  changePhone(phone: string) {
    if (!phone?.trim()) throw CustomError.badRequest("Phone is required");
    this.props.phone = phone.trim();
  }

  changeNotes(notes: string | null) {
    this.props.notes = notes?.trim() ?? null;
  }

  changeIdentifier(type: string, identifier: string) {
    if (this.isWalkIn) {
      throw CustomError.badRequest("Cannot change identifier of walk-in customer");
    }
    if (!type?.trim()) throw CustomError.badRequest("Identifier type is required");
    if (!identifier?.trim()) throw CustomError.badRequest("Identifier value is required");
    this.props.type = type.trim();
    this.props.identifier = identifier.trim();
  }

  deactivate() { this.props.isActive = false; }
  activate() { this.props.isActive = true; }

  // ─────────────────── Getters ───────────────────

  get isWalkIn(): boolean {
    return this.props.type === WALK_IN_IDENTIFIER_TYPE;
  }

  get name() { return this.props.name; }
  get email() { return this.props.email; }
  get phone() { return this.props.phone; }
  get billingAddress() { return this.props.billingAddress; }
  get shippingAddress() { return this.props.shippingAddress; }
  get type() { return this.props.type; }
  get identifier() { return this.props.identifier; }
  get companyId() { return this.props.companyId; }
  get isActive() { return this.props.isActive; }

  get snapshot() {
    return {
      id: this.id.value,
      name: this.props.name,
      email: this.props.email,
      phone: this.props.phone,
      billingAddress: this.props.billingAddress,
      shippingAddress: this.props.shippingAddress,
      notes: this.props.notes,
      type: this.props.type,
      identifier: this.props.identifier,
      companyId: this.props.companyId.getValue(),
      isActive: this.props.isActive,
      createdById: this.props.createdById?.getValue() ?? null,
      updatedById: this.props.updatedById?.getValue() ?? null,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }

  // ─────────────────── Invariants ───────────────────

  private ensureInvariants() {
    if (!this.props.name?.trim()) {
      throw CustomError.badRequest("Name is required");
    }
    if (!this.props.companyId) {
      throw CustomError.badRequest("Company is required");
    }

    // Walk-in customers have relaxed validation
    if (this.props.type === WALK_IN_IDENTIFIER_TYPE) {
      return;
    }

    // Regular customers require more details
    if (!this.props.phone?.trim()) {
      throw CustomError.badRequest("Phone is required");
    }
    if (!this.props.billingAddress?.trim()) {
      throw CustomError.badRequest("Billing address is required");
    }
    if (!this.props.shippingAddress?.trim()) {
      throw CustomError.badRequest("Shipping address is required");
    }
    if (this.props.email && !regularExps.email.test(this.props.email.trim())) {
      throw CustomError.badRequest("Invalid email format");
    }
    if (!this.props.type?.trim()) {
      throw CustomError.badRequest("Customer identifier type is required");
    }
    if (!this.props.identifier?.trim()) {
      throw CustomError.badRequest("Customer identifier is required");
    }
  }
}
