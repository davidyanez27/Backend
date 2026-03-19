import { z } from "zod";

export const AuthStatus = z.enum(["checking", "authenticated", "not-authenticated"]);

export type AuthStatus = z.infer<typeof AuthStatus>;
