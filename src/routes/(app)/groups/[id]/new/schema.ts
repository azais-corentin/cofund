import { OperationFormSchema } from '$lib/schemas';
import { Compile } from 'typebox/compile';

export const formSchema = Compile(OperationFormSchema);
export type FormSchema = ReturnType<typeof formSchema.Type>;
