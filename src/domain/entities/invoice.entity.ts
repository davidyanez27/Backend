import { CustomError } from "../../application/errors";
import { UuidV4, CompanyId, CustomerId, UserId } from "../value-objects";
import { InvoiceProps, InvoiceItemSnapshot, InvoiceStatus, InvoicePaymentMethod } from "../types";
import { UUID } from "../../config";

const error = "Invoice Id is required";

export class InvoiceEntity {
  private constructor(
    public readonly id: UuidV4,
    private props: InvoiceProps,
  ) {
    this.recalculateTotals();
    this.ensureInvariants();
  }

  static createNew(props: Omit<InvoiceProps, "status" | "subtotal" | "total"> & {
    status?: InvoiceStatus;
    subtotal?: number;
    total?: number;
  }) {
    const id = UuidV4.from(UUID.generate());

    const preparedProps: InvoiceProps = {
      ...props,
      status: props.status ?? "DRAFT",
      subtotal: 0,
      total: 0,
    };

    return new InvoiceEntity(id, preparedProps);
  }

  static fromSnapshot(snapshot: { id: string; companyId: number; customerId: number; createdById?: number | null; updatedById?: number | null } & Omit<InvoiceProps, "companyId" | "customerId" | "createdById" | "updatedById">) {
    return new InvoiceEntity(
      UuidV4.from(snapshot.id),
      {
        ...snapshot,
        companyId: new CompanyId(snapshot.companyId),
        customerId: new CustomerId(snapshot.customerId),
        createdById: snapshot.createdById ? new UserId(snapshot.createdById) : null,
        updatedById: snapshot.updatedById ? new UserId(snapshot.updatedById) : null,
      },
    );
  }

  // ─────────────────── Item Management ───────────────────

  /**
   * Adds an item. lineTotal is computed automatically.
   */
  addItem(item: Omit<InvoiceItemSnapshot, "lineTotal">) {
    this.ensureMutable();
    if (!item.description?.trim()) throw CustomError.badRequest("Item description is required");
    if (item.quantity <= 0) throw CustomError.badRequest("Item quantity must be greater than zero");
    if (item.unitPrice < 0) throw CustomError.badRequest("Item unit price cannot be negative");

    this.props.items.push({
      ...item,
      lineTotal: 0, // Will be computed by recalculateTotals
    });

    this.recalculateTotals();
  }

  removeItem(index: number) {
    this.ensureMutable();
    if (index < 0 || index >= this.props.items.length) {
      throw CustomError.badRequest("Invalid item index");
    }

    this.props.items.splice(index, 1);
    this.recalculateTotals();
  }

  // ─────────────────── Monetary Adjustments ───────────────────

  setTax(tax: number) {
    this.ensureMutable();
    if (tax < 0) throw CustomError.badRequest("Tax cannot be negative");

    this.props.tax = Number(tax.toFixed(2));
    this.recalculateTotals();
  }

  /**
   * Invoice-level discount (amount). Applied AFTER subtotal & tax.
   */
  setDiscount(discount: number) {
    this.ensureMutable();
    if (discount < 0) throw CustomError.badRequest("Discount cannot be negative");

    this.props.discount = Number(discount.toFixed(2));
    this.recalculateTotals();
  }

  // ─────────────────── Status Management ───────────────────

  markAsSent() {
    if (!this.props.items.length) {
      throw CustomError.badRequest("Cannot send invoice without items");
    }
    if (this.props.total <= 0) {
      throw CustomError.badRequest("Cannot send invoice with zero total");
    }

    this.props.status = "SENT";
  }

  markAsOverdue(now: Date = new Date()) {
    if (!this.props.dueDate) return;
    if (
      (this.props.status === "SENT" || this.props.status === "PARTIALLY_PAID") &&
      this.props.dueDate.getTime() < now.getTime()
    ) {
      this.props.status = "OVERDUE";
    }
  }

  markAsCanceled() {
    if (this.props.status === "PAID") {
      throw CustomError.badRequest("Cannot cancel a paid invoice");
    }

    this.props.status = "CANCELED";
  }

  /**
   * Updates status based on how much has been paid.
   */
  applyPayment(totalPaidSoFar: number) {
    if (totalPaidSoFar >= this.props.total) {
      this.props.status = "PAID";
    } else if (totalPaidSoFar > 0) {
      this.props.status = "PARTIALLY_PAID";
    }
  }

  // ─────────────────── Other Methods ───────────────────

  attachPdf(url: string) {
    if (!url?.trim()) throw CustomError.badRequest("PDF URL is required");
    this.props.pdfUrl = url.trim();
  }

  updateNotes(notes: string | null) {
    this.ensureMutable();
    this.props.notes = notes?.trim() ?? null;
  }

  updateDueDate(dueDate: Date | null) {
    this.ensureMutable();
    this.props.dueDate = dueDate;
  }

  updatePaymentNotes(notes: string | null) {
    this.props.paymentNotes = notes?.trim() ?? null;
  }

  updateAmountPaid(amount: number) {
    if (amount < 0) throw CustomError.badRequest("Amount paid cannot be negative");
    this.props.amountPaid = Number(amount.toFixed(2));
  }

  updatePaymentMethod(method: InvoicePaymentMethod) {
    this.props.paymentMethod = method;
  }

  // ─────────────────── Getters ───────────────────

  get number() { return this.props.number; }
  get status() { return this.props.status; }
  get currency() { return this.props.currency; }
  get issueDate() { return this.props.issueDate; }
  get dueDate() { return this.props.dueDate; }
  get subtotal() { return this.props.subtotal; }
  get tax() { return this.props.tax; }
  get discount() { return this.props.discount; }
  get total() { return this.props.total; }
  get customerId() { return this.props.customerId; }
  get customerName() { return this.props.customerName; }
  get customerAddress() { return this.props.customerAddress; }
  get customerIdentifier() { return this.props.customerIdentifier; }
  get customerEmail() { return this.props.customerEmail; }
  get companyId() { return this.props.companyId; }
  get items() { return [...this.props.items]; }
  get notes() { return this.props.notes; }
  get pdfUrl() { return this.props.pdfUrl; }

  get isPaid() { return this.props.status === "PAID"; }
  get isCanceled() { return this.props.status === "CANCELED"; }
  get isDraft() { return this.props.status === "DRAFT"; }

  get snapshot() {
    return {
      id: this.id.value,
      number: this.props.number,
      status: this.props.status,
      currency: this.props.currency,
      issueDate: this.props.issueDate,
      dueDate: this.props.dueDate,
      subtotal: this.props.subtotal,
      tax: this.props.tax,
      discount: this.props.discount,
      total: this.props.total,
      customerId: this.props.customerId.getValue(),
      customerName: this.props.customerName,
      customerAddress: this.props.customerAddress,
      customerIdentifier: this.props.customerIdentifier,
      customerEmail: this.props.customerEmail,
      companyId: this.props.companyId.getValue(),
      items: this.props.items.map(item => ({
        ...item,
        productId: item.productId?.getValue() ?? null,
      })),
      paymentMethod: this.props.paymentMethod ?? "CASH",
      amountPaid: this.props.amountPaid ?? 0,
      paymentDate: this.props.paymentDate ?? null,
      paymentNotes: this.props.paymentNotes ?? null,
      notes: this.props.notes,
      pdfUrl: this.props.pdfUrl,
      createdById: this.props.createdById?.getValue() ?? null,
      updatedById: this.props.updatedById?.getValue() ?? null,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }

  // ─────────────────── Private Methods ───────────────────

  private ensureMutable() {
    if (this.props.status === "PAID" || this.props.status === "CANCELED") {
      throw CustomError.badRequest("Cannot modify a paid or canceled invoice");
    }
  }

  /**
   * Recalculates:
   *  - lineTotal for every item (quantity * unitPrice - itemDiscount)
   *  - subtotal = sum of item lineTotals
   *  - total = subtotal + tax - discount
   */
  private recalculateTotals() {
    let subtotal = 0;

    this.props.items = this.props.items.map((item) => {
      const base = item.quantity * item.unitPrice;
      const itemDiscount = item.discount ?? 0;

      if (itemDiscount < 0) {
        throw CustomError.badRequest("Item discount cannot be negative");
      }

      const lineTotal = Number(Math.max(base - itemDiscount, 0).toFixed(2));
      subtotal += lineTotal;

      return {
        ...item,
        lineTotal,
      };
    });

    this.props.subtotal = Number(subtotal.toFixed(2));

    const total = this.props.subtotal + this.props.tax - this.props.discount;
    if (total < 0) throw CustomError.badRequest("Total cannot be negative");

    this.props.total = Number(total.toFixed(2));
  }

  private ensureInvariants() {
    if (!this.props.number?.trim()) {
      throw CustomError.badRequest("Invoice number is required");
    }
    if (!this.props.currency?.trim()) {
      throw CustomError.badRequest("Currency is required");
    }
    if (!this.props.customerId) {
      throw CustomError.badRequest("Customer ID is required");
    }
    if (!this.props.companyId) {
      throw CustomError.badRequest("Company ID is required");
    }
    if (this.props.tax < 0 || this.props.discount < 0) {
      throw CustomError.badRequest("Monetary values cannot be negative");
    }
  }
}
