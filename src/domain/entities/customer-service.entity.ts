import { CustomError } from "../../application/errors";
import { CustomerServiceProps } from "../types";
import { Money, CustomerId, ProductId } from "../value-objects";

const error = "Customer Service Id is required";

export class CustomerServiceEntity {
  private constructor(
    private props: CustomerServiceProps,
  ) {
    this.ensureInvariants();
  }

  // Factory for new association Customer <-> Product
  static createNew(props: CustomerServiceProps) {
    return new CustomerServiceEntity({...props});
  }

  // Rehydrate from persistence
  static fromSnapshot(snapshot: { customerId: number; productId: number; customPrice: Money; notes: string | null }) {
    return new CustomerServiceEntity({
      customerId: new CustomerId(snapshot.customerId),
      productId: new ProductId(snapshot.productId),
      customPrice: snapshot.customPrice,
      notes: snapshot.notes,
    });
  }

  // ---------- behavior (change methods) ----------

  changeCustomer(customerId: CustomerId) {
    this.props.customerId = customerId;
  }

  changeProduct(productId: ProductId) {
    this.props.productId = productId;
  }

  changePrice(newPrice: Money) {
    if (newPrice.amount < 0) throw new Error("customPrice cannot be negative");
    this.props.customPrice = newPrice;
  }

  changeNotes(notes: string | null) {
    if (typeof notes === "string" && !notes.trim()) throw new Error("notes cannot be only whitespace");
    this.props.notes = notes ?? null;
  }

  // ---------- read model ----------

  get snapshot() {
    return {
      customerId: this.props.customerId.getValue(),
      productId: this.props.productId.getValue(),
      customPrice: this.props.customPrice,
      notes: this.props.notes,
    };
  }

  // ---------- invariants ----------

  private ensureInvariants() {
    if (!this.props.customerId) throw CustomError.badRequest("customerId is required");
    if (!this.props.productId) throw CustomError.badRequest("productId is required");
    if (typeof this.props.notes === "string" && !this.props.notes.trim()) throw CustomError.badRequest("notes cannot be only whitespace");
  }
}
