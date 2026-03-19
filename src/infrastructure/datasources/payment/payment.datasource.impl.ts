import { PaymentEntity } from '../../../domain/entities';
import { PaymentRepository } from '../../../domain/repositories';
import { prisma } from '../../data/PotsgreSQL/index';
import { PaymentCommandMapper } from '../../mappers';

export class PaymentDatasourceImpl implements PaymentRepository {

    async add(payment: PaymentEntity): Promise<void> {
        const data = PaymentCommandMapper.toPrismaCreate(payment);
        await prisma.subscriptionPayment.create({ data });
    }

    async save(payment: PaymentEntity): Promise<void> {
        const { id } = payment.snapshot;
        const data = PaymentCommandMapper.toPrismaUpdate(payment);
        await prisma.subscriptionPayment.update({
            where: { uuid: id },
            data,
        });
    }

    async getById(uuid: string, companyId: number): Promise<PaymentEntity | null> {
        const row = await prisma.subscriptionPayment.findFirst({
            where: { uuid, companyId },
        });
        if (!row) return null;
        return PaymentCommandMapper.fromPrisma(row);
    }

    async delete(uuid: string, companyId: number): Promise<void> {
        const payment = await prisma.subscriptionPayment.findFirst({
            where: { uuid, companyId },
            select: { id: true },
        });
        if (!payment) return;
        await prisma.subscriptionPayment.delete({
            where: { id: payment.id },
        });
    }
}