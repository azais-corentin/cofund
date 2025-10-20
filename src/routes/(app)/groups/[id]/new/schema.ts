import Type from 'typebox';
import { Compile } from 'typebox/compile';

export const formSchema = Type.Object({
  title: Type.String({
    minLength: 2,
    maxLength: 255,
    error: 'Title must be between 2 and 255 characters',
  }),
  amount: Type.Number({
    minimum: 0.01,
    error: 'Amount must be greater than 0',
  }),
  paid_by: Type.String({
    minLength: 1,
    maxLength: 255,
    error: 'Please select who paid',
  }),
  date: Type.Number({
    error: 'Please select a valid date',
  }),
  split_type: Type.Union([
    Type.Literal('equally'),
    Type.Literal('as_parts'),
    Type.Literal('by_amount'),
  ], {
    default: 'equally',
    error: 'Invalid split type',
  }),
  split: Type.String({
    minLength: 1,
    error: 'Split data is required',
  }),
});

export const compiledFormSchema = Compile(formSchema);

export type FormSchema = typeof formSchema;
