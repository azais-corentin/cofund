import { Compile } from 'typebox/compile';
import { GroupFormSchema } from '$lib/schemas';

export const formSchema = Compile(GroupFormSchema);
export type FormSchema = ReturnType<typeof formSchema.Type>;
