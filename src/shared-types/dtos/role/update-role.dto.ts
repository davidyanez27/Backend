import { regularExps } from "../../config";

export class UpdateRoleDto {
    constructor(
        public readonly name?: string,
        public readonly canRead?: boolean,
        public readonly canWrite?: boolean,
    ) { }

    static create(props: { [key: string]: any }): [string?, UpdateRoleDto?] {
        const { name, canRead, canWrite } = props;

        if (name !== undefined) {
            if (name.length < 2) return ['name must be at least 2 characters long'];
            if (name.length > 50) return ['name must be less than 50 characters'];
            if (!regularExps.name.test(name)) return ['Invalid name format, please avoid using special characters'];
        }

        if (canRead !== undefined && typeof canRead !== 'boolean') {
            return ['canRead must be a boolean value'];
        }

        if (canWrite !== undefined && typeof canWrite !== 'boolean') {
            return ['canWrite must be a boolean value'];
        }

        return [undefined, new UpdateRoleDto(name, canRead, canWrite)];
    }
}
