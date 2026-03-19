import { z } from 'zod';

export const Theme = z.enum(["light", "dark"]);


export type Theme = z.infer<typeof Theme>;