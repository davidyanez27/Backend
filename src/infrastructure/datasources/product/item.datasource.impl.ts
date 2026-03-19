import { ProductEntity } from '../../../domain/entities';
import { ProductsRepository } from '../../../domain/repositories';
import { prisma } from '../../data/PotsgreSQL/index';
import { ProductCommandMapper, withProductRelations } from '../../mappers';

export class ProductDatasourceImpl implements ProductsRepository {

    async add(product: ProductEntity): Promise<void> {
        const data = ProductCommandMapper.toPrismaCreate(product);
        await prisma.item.create({ data });
        return;
    }

    async save(product: ProductEntity): Promise<void> {
        const { companyId } = product.snapshot;
        const data = ProductCommandMapper.toPrismaUpdate(product);
        await prisma.item.update({
            where: { uuid: product.id.value, companyId },
            data,
        });

        return;
    }

    async getById(uuid: string, companyId: number): Promise<ProductEntity | null> {
        const row = await prisma.item.findFirst({
            where: { uuid, companyId},
            ...withProductRelations,
        });
        if (!row) return null;
        return ProductCommandMapper.fromPrisma(row);
    }

    async delete(uuid: string, companyId: number): Promise<void> {
        await prisma.item.delete({
            where: { uuid, companyId},
        });
        return;
    }
}