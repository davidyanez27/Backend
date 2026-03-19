import { SubscriptionPayment } from "@prisma/client";
import { Payment } from "@inventory/shared-types";

export const PaymentQueryMapper = {
  toDto(row: SubscriptionPayment & { company?: { uuid: string } }): Payment {
    const { uuid, amount, currency, paymentMethod, status, description, stripePaymentIntentId, paidAt, createdAt, updatedAt } = row;
    return {
      id: uuid,
      amount: amount.toNumber(),
      currency,
      method: paymentMethod,
      status,
      description: description ?? undefined,
      reference: stripePaymentIntentId ?? undefined,
      paidAt: paidAt?.toISOString(),
      owner: row.company?.uuid ?? "",
      isActive: status !== "FAILED" && status !== "REFUNDED",
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    };
  },
};
