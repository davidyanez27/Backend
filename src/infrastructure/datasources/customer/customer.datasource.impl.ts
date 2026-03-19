import { CustomerEntity } from "../../../domain/entities";
import { CustomerRepository } from '../../../domain/repositories';
import { CustomerCommandMapper, withCustomerRelations } from '../../mappers';
import { prisma } from "../../data/PotsgreSQL/index";

export class CustomerDatasourceImpl implements CustomerRepository {

  async add( customer: CustomerEntity ): Promise<void> {
    const data = CustomerCommandMapper.toPrismaCreate( customer );
    await prisma.customer.create({ data });

    return;
  }

  async save(customer: CustomerEntity): Promise<void> {
    const { id, companyId} = customer.snapshot;
    const data = CustomerCommandMapper.toPrismaUpdate(customer);
    const updated = await prisma.customer.update({
      where: { uuid: id, companyId },
      data,
    });
    await prisma.customer.findUniqueOrThrow({
      where: { id: updated.id },
      ...withCustomerRelations,
    });
    return;
  }

  async getById(id: string, companyId: number): Promise<CustomerEntity | null> {
    const row = await prisma.customer.findFirst({
      where: { uuid: id, companyId},
      ...withCustomerRelations,
    });
    if (!row) return null;
    return CustomerCommandMapper.fromPrisma(row);
  }

    async delete(id: string, companyId: number): Promise<void> {
    await prisma.customer.delete({
      where: { uuid: id, companyId}
    });
  }
}
