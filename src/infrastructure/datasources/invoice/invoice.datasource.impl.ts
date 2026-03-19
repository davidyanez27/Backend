import { InvoiceEntity } from '../../../domain/entities';
import { InvoiceRepository } from '../../../domain/repositories';
import { prisma } from '../../data/PotsgreSQL/index';
import { InvoiceCommandMapper } from '../../mappers';
import { withRelations } from '../../mappers/invoice/invoice.mapper';

export class InvoiceDatasourceImpl implements InvoiceRepository {

    async add(invoice: InvoiceEntity): Promise<void> {
        const { customerId, companyId } = invoice.snapshot;

        await prisma.$transaction(async (tx) => {
            let seq = await tx.invoiceSequence.findUnique({ where: { companyId } });

            if (!seq) {
                // First time: find the highest existing invoice number to avoid collisions
                const last = await tx.invoice.findFirst({
                    where: { companyId },
                    orderBy: { id: 'desc' },
                    select: { number: true },
                });
                const lastNum = last?.number?.match(/\d+$/);
                const startAt = lastNum ? parseInt(lastNum[0], 10) + 1 : 1;

                seq = await tx.invoiceSequence.create({
                    data: { companyId, current: startAt, prefix: 'INV', suffix: '' },
                });
            } else {
                seq = await tx.invoiceSequence.update({
                    where: { companyId },
                    data: { current: { increment: 1 } },
                });
            }

            const number = `${seq.prefix}-${String(seq.current).padStart(4, '0')}${seq.suffix}`;

            const data = InvoiceCommandMapper.toPrismaCreate(invoice, companyId, customerId);
            data.number = number;

            await tx.invoice.create({ data });
        });
    }

    async save(invoice: InvoiceEntity): Promise<void> {
        const { id, companyId } = invoice.snapshot;
        await prisma.invoice.update({
            where: { uuid: id, companyId },
            data: InvoiceCommandMapper.toPrismaUpdate(invoice)
        });
    }

    async getById(uuid: string, companyId: number): Promise<InvoiceEntity | null> {
        const row = await prisma.invoice.findFirst({
            where: { uuid, companyId },
            ...withRelations,
        });

        if (!row) return null;
        return InvoiceCommandMapper.fromPrisma(row);
    }

    async delete(uuid: string, companyId: number): Promise<void> {
        await prisma.invoice.delete({
            where: { uuid, companyId }
        });
    }
}