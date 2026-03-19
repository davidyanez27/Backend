import { CompanyEntity } from '../../../domain/entities';
import { CompanyRepository } from '../../../domain/repositories';
import { CompanyDatasourceImpl } from '../../datasources';


export class CompanyRepositoryImpl implements CompanyRepository {

    constructor (
        private readonly companysDatasource : CompanyDatasourceImpl,
    ){}
    add(company: CompanyEntity, userId: number): Promise<void> {
        return this.companysDatasource.add(company, userId);
    }
    save(company: CompanyEntity, userId: number): Promise<void> {
        return this.companysDatasource.save(company, userId);
    }
    delete(uuid: string, userId: number): Promise<void> {
        return this.companysDatasource.delete(uuid, userId);
    }
    getById(uuid: string, userId: number): Promise<CompanyEntity | null> {
        return this.companysDatasource.getById(uuid, userId);
    }
}
