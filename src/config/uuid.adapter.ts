import { v4 as uuidv4} from 'uuid'

export const UUID = {
    generate: ():string => {
        return uuidv4();
    },
}