import { z } from 'zod';
import { Username } from './common.js';

export const GroupSchema = z.object({
  id: z.uuid(),
  name: z.string().min(2).max(255),
  currency: z.string().min(1).max(255).default('€'),
  users: z.array(Username).min(1),
  created_at: z.iso.datetime(),
});

export type Group = z.infer<typeof GroupSchema>;

export const GroupFormSchema = z.object({
  name: z.string().min(2).max(255),
  currency: z.string().min(1).max(255).default('€'),
  users: z
    .array(
      z.object({
        uuid: z.number(),
        name: z.string().min(2).max(255),
      }),
    )
    .min(1)
    .max(255),
});

export type GroupFormData = z.infer<typeof GroupFormSchema>;
