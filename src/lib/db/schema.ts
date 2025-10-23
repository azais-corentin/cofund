import { Compile } from 'typebox/compile';
import Type from 'typebox';
import { GroupSchema, OperationSchema } from '$lib/schemas';

export const group = Compile(GroupSchema);
export const operation = Compile(OperationSchema);

export type Group = Type.Static<typeof GroupSchema>;
export type Operation = Type.Static<typeof OperationSchema>;
