import { Compile } from 'typebox/compile';
import { OperationFormSchema } from '$lib/schemas';

export const formSchema = Compile(OperationFormSchema);
export type FormSchema = ReturnType<typeof formSchema.Type>;
