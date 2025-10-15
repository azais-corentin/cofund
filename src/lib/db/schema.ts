import type { Row, TablesSchema } from 'tinybase';
import Type from 'typebox';
import { Compile } from 'typebox/compile';

const groupObject = Type.Object({
  id: Type.String(),
  name: Type.String(),
  currency: Type.String(),
  users: Type.String(), // JSON
  created_at: Type.Number(),
});
const group = Compile(groupObject);

const operationObject = Type.Object({
  id: Type.String(),
  group_id: Type.String(),
  created_at: Type.Number(),
  title: Type.String(),
  amount: Type.Number(),
  paid_by: Type.String(),
  split_type: Type.String(),
  split: Type.String(),
});
const operation = Compile(operationObject);

export type Group = Type.Static<typeof group>;
export type Operation = Type.Static<typeof operation>;

export const tablesSchema: TablesSchema = {
  groups: groupObject.properties,
  operations: operationObject.properties,
};

export const serializeGroup = (group: Omit<Group, 'id'>): Row => ({
  name: group.name,
  currency: group.currency,
  users: JSON.stringify(group.users),
  created_at: group.created_at,
});

export const deserializeGroup = (id: string, row: Row): Group => ({
  id,
  name: row.name as string,
  currency: row.currency as string,
  users: JSON.parse(row.users as string),
  created_at: row.created_at as number,
});

export const serializeOperation = (operation: Omit<Operation, 'id'>): Row => ({
  group_id: operation.group_id,
  created_at: operation.created_at,
  title: operation.title,
  amount: operation.amount,
  paid_by: operation.paid_by,
  split_type: operation.split_type,
  split: operation.split,
});

export const deserializeOperation = (id: string, row: Row): Operation => ({
  id,
  group_id: row.group_id as string,
  created_at: row.created_at as number,
  title: row.title as string,
  amount: row.amount as number,
  paid_by: row.paid_by as string,
  split_type: row.split_type as string,
  split: row.split as string,
});
