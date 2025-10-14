import type { Row } from 'tinybase';

// TinyBase uses a simple key-value structure for tables
// Schema is defined by the data structure you use

export interface Group {
  id: string;
  name: string;
  currency: string;
  users: string[]; // Stored as JSON string in TinyBase
  created_at: number; // Timestamp
}

export interface Operation {
  id: string;
  group_id: string;
  created_at: number; // Timestamp
  title: string;
  amount: number;
  paid_by: string;
  split_type: string;
  split: string; // JSON string of array of { user: string, value: number }
}

// Helper functions for type-safe data operations
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
