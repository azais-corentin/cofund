import { z } from 'zod';

export const ShortText = z
  .string()
  .min(2, { error: 'Field must be at least 2 characters long' })
  .max(255, { error: 'Field must be at most 255 characters long' });

export const SplitType = z.enum(['equally', 'as_parts', 'by_amount']).default('equally');
