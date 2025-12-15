"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/admin";
import {
  createTodo,
  deleteTodo,
  updateTodo,
} from "@/lib/todos";

function refreshTodoViews() {
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function createTodoAction(formData: FormData) {
  const title = formData.get("title");
  const description = formData.get("description");

  if (typeof title !== "string") {
    return;
  }

  const trimmedTitle = title.trim();

  if (!trimmedTitle) {
    return;
  }

  await createTodo({
    title: trimmedTitle,
    description:
      typeof description === "string" && description.trim().length > 0
        ? description.trim()
        : null,
  });

  refreshTodoViews();
}

export async function toggleTodoAction(formData: FormData) {
  const id = Number(formData.get("id"));
  const completedValue = formData.get("completed");

  if (!Number.isFinite(id)) {
    return;
  }

  const nextCompleted =
    completedValue === "true" || completedValue === "1" || completedValue === "on";

  await updateTodo(id, { completed: nextCompleted });
  refreshTodoViews();
}

export async function deleteTodoAction(formData: FormData) {
  const id = Number(formData.get("id"));

  if (!Number.isFinite(id)) {
    return;
  }

  await deleteTodo(id);
  refreshTodoViews();
}

export async function adminUpdateTodoAction(formData: FormData) {
  assertAdmin();

  const id = Number(formData.get("id"));
  const title = formData.get("title");
  const description = formData.get("description");
  const completedValues = formData.getAll("completed");
  const completed = completedValues.at(-1) ?? undefined;

  if (!Number.isFinite(id)) {
    return;
  }

  const updates: {
    title?: string;
    description?: string | null;
    completed?: boolean;
  } = {};

  if (typeof title === "string" && title.trim()) {
    updates.title = title.trim();
  }

  if (typeof description === "string") {
    updates.description = description.trim() ? description.trim() : null;
  }

  if (typeof completed === "string") {
    updates.completed = completed === "true" || completed === "on" || completed === "1";
  }

  await updateTodo(id, updates);
  refreshTodoViews();
}
