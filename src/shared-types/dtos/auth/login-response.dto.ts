import { z } from "zod";
import { UserSchema } from "../users";
import { CompanySchema } from "../company";

export const LoginResponse = z.object({
  user: UserSchema,
  company: CompanySchema,
}).strict();

export type LoginResponseDto = z.infer<typeof LoginResponse>;
