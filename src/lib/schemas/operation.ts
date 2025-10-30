import { z } from 'zod';
import { ShortText, SplitType } from './common.js';

export const OperationSchema = z.object({
  id: z.uuid(),
  group_id: z.uuid(),
  created_at: z.iso.datetime(),
  title: z.string().min(2).max(255),
  amount: z.number().min(0.01),
  paid_by: ShortText,
  split_type: SplitType,
  split: z.record(ShortText, z.number()),
});

export type Operation = z.infer<typeof OperationSchema>;

export const OperationFormSchema = OperationSchema.omit({
  id: true,
  group_id: true,
  created_at: true,
});

export type OperationForm = z.infer<typeof OperationFormSchema>;
