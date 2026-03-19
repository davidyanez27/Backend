import z from 'zod';
import { Paginated } from '../shared';
import { UserSchema } from './user.dto';

export const ListUsers = z.object({
  users: Paginated(UserSchema)
})

export type ListUsers = z.infer<typeof ListUsers>;
