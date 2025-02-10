import { z } from 'zod';

export const formSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters long')
        .max(255, 'Name must be at most 255 characters long'),
    currency: z
        .string()
        .min(1, 'Currency must be at least 1 character long')
        .max(255, 'Currency must be at most 255 characters long')
        .default('$'),
    users: z
        .array(
            z
                .string()
                .min(2, 'User name must be at least 2 characters long')
                .max(255, 'User name must be at most 255 characters long')
        )
        .min(1, 'At least one user is required')
        .max(255, 'No more than 255 users allowed')
        .default([''])
});

export type FormSchema = typeof formSchema;
