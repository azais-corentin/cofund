import Type, { type Static } from 'typebox'

export const formSchema = Type.Object({
  name: Type.String({
    minLength: 2,
    maxLength: 100,
    error: 'Name must be between 2 and 100 characters',
  }),
  bio: Type.Optional(
    Type.String({
      maxLength: 500,
      error: 'Bio must be at most 500 characters',
    }),
  ),
})

export type FormSchema = Static<typeof formSchema>
