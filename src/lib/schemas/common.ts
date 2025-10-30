import { z } from 'zod';

export const Username = z.string().min(2).max(255);

export const SplitType = z.enum(['equally', 'as_parts', 'by_amount']).default('equally');
