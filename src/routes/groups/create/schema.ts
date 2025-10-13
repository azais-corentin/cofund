import * as v from 'valibot';

export const formSchema = v.object({
  name: v.pipe(
    v.string(),
    v.minLength(2, 'Name must be at least 2 characters long'),
    v.maxLength(255, 'Name must be at most 255 characters long'),
  ),
  currency: v.optional(
    v.pipe(
      v.string(),
      v.minLength(1, 'Currency must be at least 1 character long'),
      v.maxLength(255, 'Currency must be at most 255 characters long'),
    ),
    '$',
  ),
  users: v.optional(
    v.pipe(
      v.array(v
        .object({
          uuid: v.number(),
          name: v.pipe(
            v.string(),
            v.minLength(2, 'User name must be at least 2 characters long'),
            v.maxLength(255, 'User name must be at most 255 characters long'),
          ),
        })),
      v.minLength(1, 'At least one user is required'),
      v.maxLength(255, 'No more than 255 users allowed'),
    ),
    [{ uuid: 0, name: '' }],
  ),
});

export type FormSchema = typeof formSchema;
