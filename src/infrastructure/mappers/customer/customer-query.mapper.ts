import { Customer } from '@inventory/shared-types';
import { Prisma } from "@prisma/client";

export const withCustomerRelations = Prisma.validator<Prisma.CustomerDefaultArgs>()({
  include: {
    company: { select: { uuid: true } }
  }
});
export type CustomerWithCompany = Prisma.CustomerGetPayload<typeof withCustomerRelations>;

export const CustomerQueryMapper = {
  toDto(row: CustomerWithCompany): Customer {
    const { uuid, name, email, phone, billingAddress, shippingAddress, type, identifier, notes, isActive, createdAt, updatedAt } = row;
    return {
      id: uuid,
      name,
      email: email ?? undefined,
      phone,
      billingAddress,
      shippingAddress,
      identifier: { type, value: identifier },
      notes: notes ?? undefined,
      isActive,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    };
  },
};
