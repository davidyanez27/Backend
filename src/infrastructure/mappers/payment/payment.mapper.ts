import { PaymentEntity } from '../../../domain/entities';
import { SubscriptionPayment, Prisma } from "@prisma/client";

export const PaymentCommandMapper = {
  fromPrisma(row: SubscriptionPayment): PaymentEntity {
    const { uuid, subscriptionId, companyId, amount, paymentMethod, stripePaymentIntentId, status, paidAt } = row;

    return PaymentEntity.fromSnapshot({
      id: uuid,
      invoiceId: subscriptionId ?? 0,
      companyId,
      amount: amount.toNumber(),
      method: paymentMethod,
      reference: stripePaymentIntentId ?? null,
      status: status as PaymentEntity['snapshot']['status'],
      paidAt: paidAt ?? new Date(),
      isActive: true,
    });
  },

  toPrismaCreate(entity: PaymentEntity): Prisma.SubscriptionPaymentUncheckedCreateInput {
    const { id, amount, method, reference, status, paidAt, companyId } = entity.snapshot;
    return {
      uuid: id,
      companyId,
      amount: new Prisma.Decimal(amount),
      currency: "USD",
      paymentMethod: method as Prisma.SubscriptionPaymentUncheckedCreateInput['paymentMethod'],
      status: status as Prisma.SubscriptionPaymentUncheckedCreateInput['status'],
      stripePaymentIntentId: reference ?? null,
      paidAt,
    };
  },

  toPrismaUpdate(entity: PaymentEntity): Prisma.SubscriptionPaymentUncheckedUpdateInput {
    const { status, reference } = entity.snapshot;
    return {
      status: status as Prisma.SubscriptionPaymentUncheckedUpdateInput['status'],
      stripePaymentIntentId: reference ?? null,
    };
  },
};
