import db, { type DB } from '@/lib/db';
import { type Selectable, type Updateable } from 'kysely';

export interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: Date;
  updated_at: Date;
}

function toTodo(row: Selectable<DB['todos']>): Todo {
  return {
    ...row,
    completed: Boolean(row.completed),
  };
}

export async function listTodos(options?: { completed?: boolean }) {
  let query = db
    .selectFrom('todos')
    .selectAll()
    .orderBy('created_at', 'desc');

  if (typeof options?.completed === 'boolean') {
    query = query.where('completed', '=', options.completed);
  }

  const todos = await query.execute();
  return todos.map(toTodo);
}

export async function getTodoById(id: number) {
  const todo = await db
    .selectFrom('todos')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst();

  return todo ? toTodo(todo) : null;
}

export async function createTodo(input: {
  title: string;
  description?: string | null;
}) {
  const result = await db
    .insertInto('todos')
    .values({
      title: input.title,
      description: input.description ?? null,
    })
    .executeTakeFirst();

  const insertedId = result?.insertId
    ? Number(result.insertId)
    : undefined;

  if (!insertedId) {
    throw new Error('Failed to create todo');
  }

  return getTodoById(insertedId);
}

export async function updateTodo(
  id: number,
  updates: Partial<Pick<Todo, 'title' | 'description' | 'completed'>>,
) {
  const payload: Partial<Updateable<DB['todos']>> = {};

  if (typeof updates.title === 'string') {
    payload.title = updates.title;
  }

  if (typeof updates.description === 'string' || updates.description === null) {
    payload.description = updates.description;
  }

  if (typeof updates.completed === 'boolean') {
    payload.completed = updates.completed;
  }

  if (Object.keys(payload).length === 0) {
    return getTodoById(id);
  }

  const result = await db
    .updateTable('todos')
    .set(payload)
    .where('id', '=', id)
    .executeTakeFirst();

  if (!result || result.numUpdatedRows === BigInt(0)) {
    return null;
  }

  return getTodoById(id);
}

export async function deleteTodo(id: number) {
  const result = await db
    .deleteFrom('todos')
    .where('id', '=', id)
    .executeTakeFirst();

  return result.numDeletedRows > BigInt(0);
}
