import { CustomError } from "../../application/errors";
import { UuidV4, CompanyId, InvoiceId } from "../value-objects";
import { UUID } from "../../config";
import { PaymentProps, PaymentStatus } from "../types/payment.type";


const error = "Payment Id is required";

export class PaymentEntity {
  private constructor(
    public readonly id: UuidV4,
    private props: PaymentProps,
  ) {
    this.ensureInvariants();
  }

  static createNew(props: Omit<PaymentProps, "status"> & { status?: PaymentStatus }) {
    const id = UuidV4.from(UUID.generate());
    return new PaymentEntity(id, { status: "PENDING", ...props });
  }

  static fromSnapshot(snapshot: { id: string; invoiceId: number; companyId: number } & Omit<PaymentProps, "invoiceId" | "companyId">) {
    return new PaymentEntity(UuidV4.from(snapshot.id), {
      ...snapshot,
      invoiceId: new InvoiceId(snapshot.invoiceId),
      companyId: new CompanyId(snapshot.companyId),
    });
  }

  markCompleted() {
    if (this.props.status !== "PENDING") throw CustomError.badRequest("Only pending payments can be completed");
    this.props.status = "COMPLETED";
  }

  markFailed() {
    if (this.props.status === "COMPLETED") throw CustomError.badRequest("Cannot mark a completed payment as failed");
    this.props.status = "FAILED";
  }

  refund() {
    if (this.props.status !== "COMPLETED") throw CustomError.badRequest("Only completed payments can be refunded");
    this.props.status = "REFUNDED";
  }

  deactivate() { this.props.isActive = false; }
  activate() { this.props.isActive = true; }

  get snapshot() {
    return {
      id: this.id.value,
      invoiceId: this.props.invoiceId.getValue(),
      companyId: this.props.companyId.getValue(),
      amount: this.props.amount,
      method: this.props.method,
      reference: this.props.reference,
      status: this.props.status,
      paidAt: this.props.paidAt,
      isActive: this.props.isActive,
    };
  }

  private ensureInvariants() {
    if (!this.props.invoiceId) throw CustomError.badRequest("Invoice Id is required");
    if (!this.props.companyId) throw CustomError.badRequest("Company Id is required");
    if (this.props.amount <= 0) throw CustomError.badRequest("Payment amount must be greater than zero");
    if (!this.props.method?.trim()) throw CustomError.badRequest("Payment method is required");
  }
}
