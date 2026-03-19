import { CustomerEntity } from '../../domain/entities';
import { CreateCustomerDto, Customer } from "@inventory/shared-types";
import { CompanyId } from '../../domain/value-objects';

export const DtoCustomerMapper = {
  FromDto(dto: CreateCustomerDto, companyId: number): CustomerEntity {
    const { name, type, identifier, billingAddress, shippingAddress, phone, email, notes, isActive } = dto;
    return CustomerEntity.createNew({
      name,
      type,
      identifier,
      billingAddress,
      shippingAddress,
      phone,
      email: email ?? null,
      companyId: new CompanyId(companyId),
      notes: notes ?? null,
      isActive,
    });
  },

  ToDto(customerEntity: CustomerEntity): Customer {
    const { id, name, billingAddress, shippingAddress, phone, email, notes, type, identifier, isActive, createdAt, updatedAt } = customerEntity.snapshot;
    return {
      id,
      name,
      phone,
      billingAddress,
      shippingAddress,
      email: email ?? undefined,
      notes: notes ?? undefined,
      identifier: { type, value: identifier },
      isActive,
      createdAt: createdAt?.toISOString() || '',
      updatedAt: updatedAt?.toISOString() || '',
    };
  }
};
