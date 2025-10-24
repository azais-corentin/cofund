import Type, { type Static } from 'typebox';

// Shared enums
export const SplitType = Type.Enum(['equally', 'as_parts', 'by_amount'], {
  default: 'equally',
  error: 'Invalid split type',
});

// DB shapes
export const GroupSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  name: Type.String({
    minLength: 2,
    maxLength: 255,
    error: 'Name must be between 2 and 255 characters',
  }),
  currency: Type.String({
    minLength: 1,
    maxLength: 255,
    default: '€',
    error: 'Currency must be between 1 and 255 characters',
  }),
  users: Type.Array(Type.String({ minLength: 2, maxLength: 255 }), { minItems: 1 }),
  created_at: Type.String({ format: 'date-time' }),
});

export const OperationSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  group_id: Type.String({ format: 'uuid' }),
  created_at: Type.String({ format: 'date-time' }),
  title: Type.String({
    minLength: 2,
    maxLength: 255,
    error: 'Title must be between 2 and 255 characters',
  }),
  amount: Type.Number({
    minimum: 0.01,
    error: 'Amount must be greater than 0',
  }),
  paid_by: Type.Array(
    Type.String({ minLength: 1, maxLength: 255, error: 'Please select who paid' }),
    { minItems: 1, error: 'Please select who paid' },
  ),
  split_type: SplitType,
  // Store as serialized JSON string (aligns with UI usage)
  split: Type.String({
    minLength: 1,
    error: 'Split data is required',
  }),
});

export type Group = Static<typeof GroupSchema>;
export type Operation = Static<typeof OperationSchema>;

// Form shapes
export const GroupFormSchema = Type.Object({
  name: GroupSchema.properties.name,
  currency: GroupSchema.properties.currency,
  users: Type.Array(
    Type.Object({
      uuid: Type.Number(),
      name: Type.String({
        minLength: 2,
        maxLength: 255,
        error: 'User name must be between 2 and 255 characters',
      }),
    }),
    {
      minItems: 1,
      maxItems: 255,
      error: 'Must have between 1 and 255 users',
    },
  ),
});

export const OperationFormSchema = Type.Pick(
  OperationSchema,
  Type.Union([
    Type.Literal('created_at'),
    Type.Literal('title'),
    Type.Literal('amount'),
    Type.Literal('paid_by'),
    Type.Literal('split_type'),
    Type.Literal('split'),
  ]),
);
