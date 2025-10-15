import Type from 'typebox';
import { Compile } from 'typebox/compile';

export const formSchema = Type.Object({
  name: Type.String({
    minLength: 2,
    maxLength: 255,
    error: 'Name must be between 2 and 255 characters',
  }),
  currency: Type.Optional(
    Type.String({
      minLength: 1,
      maxLength: 255,
      default: '$',
      error: 'Currency must be between 1 and 255 characters',
    }),
  ),
  users: Type.Optional(
    Type.Array(
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
        default: [{ uuid: 0, name: '' }],
        error: 'Must have between 1 and 255 users',
      },
    ),
  ),
});

// Compile the schema for high-performance validation
export const compiledFormSchema = Compile(formSchema);

export type FormSchema = typeof formSchema;
