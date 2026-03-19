import { CustomerEntity } from '../../../domain/entities';
import { Customer, Prisma } from "@prisma/client";


export const CustomerCommandMapper = {

  fromPrisma(row: Customer): CustomerEntity {
    const { uuid, name, email, phone, billingAddress, shippingAddress, notes, type, identifier, isActive, companyId, createdById, updatedById } = row;
    return CustomerEntity.fromSnapshot({
      id: uuid,
      name,
      email: email ?? null,
      phone,
      billingAddress,
      shippingAddress,
      notes,
      type,
      identifier,
      companyId,
      isActive,
      createdById: createdById ?? null,
      updatedById: updatedById ?? null,
    });
  },

  toPrismaCreate(customerEntity: CustomerEntity): Prisma.CustomerUncheckedCreateInput {
    const {id, name, email, phone, billingAddress, shippingAddress, notes, type, identifier, isActive, companyId, createdById } = customerEntity.snapshot;
    return {
      uuid: id,
      name,
      email: email ?? null,
      phone,
      billingAddress,
      shippingAddress,
      notes: notes ?? null,
      type,
      identifier,
      isActive,
      companyId,
      createdById: createdById ?? null,
    };
  },

  toPrismaUpdate(customerEntity: CustomerEntity): Prisma.CustomerUpdateInput {
    const customer = customerEntity.snapshot;
    return {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      billingAddress: customer.billingAddress,
      shippingAddress: customer.shippingAddress,
      notes: customer.notes,
      type: customer.type,
      identifier: customer.identifier,
      isActive: customer.isActive,
    };
  },
};
