import type { ColumnType, Generated } from 'kysely';

export interface TodosTable {
  id: Generated<number>;
  title: string;
  description: string | null;
  completed: Generated<boolean>;
  created_at: Generated<Date>;
  updated_at: ColumnType<Date, Date | undefined, Date | undefined>;
}

export interface DB {
  todos: TodosTable;
}
