import { UserEntity} from '../../../domain/entities';
import { UserRepository } from '../../../domain/repositories';
import { UserDatasourceImpl } from '../../datasources';

export class UserRepositoryImpl implements UserRepository {

    constructor (
        private readonly usersDatasourceImpl : UserDatasourceImpl,
    ){}
    add(user: UserEntity): Promise<void> {
        return this.usersDatasourceImpl.add( user );
    }
    save(user: UserEntity): Promise<void> {
        return this.usersDatasourceImpl.save( user );
    }
    delete(id: string, companyId: number): Promise<void> {
        return this.usersDatasourceImpl.delete( id, companyId);
    }
    getById(uuid: string, companyId: number): Promise<UserEntity | null> {
        return this.usersDatasourceImpl.getById( uuid, companyId);
    }

}