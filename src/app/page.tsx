import Link from "next/link";
import { createTodoAction, deleteTodoAction, toggleTodoAction } from "@/app/actions/todos";
import { listTodos } from "@/lib/todos";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function Home() {
  const todos = await listTodos();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <main className="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-12">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Todos
            </p>
            <h1 className="text-4xl font-semibold text-foreground sm:text-5xl">
              Keep track of your day
            </h1>
            <p className="text-muted-foreground">
              Add tasks, mark them done, and clear out what&apos;s finished.
            </p>
          </div>
          <Link
            href="/admin"
            className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground shadow-sm transition hover:-translate-y-px hover:border-primary hover:text-primary"
          >
            Go to admin
          </Link>
        </header>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Quick add
              </p>
              <h2 className="text-lg font-semibold text-foreground">
                Create a new todo
              </h2>
            </div>
          </div>
          <form action={createTodoAction} className="mt-4 space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                name="title"
                placeholder="Pick up groceries"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                required
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Add todo
              </button>
            </div>
            <textarea
              name="description"
              placeholder="Optional details to remember..."
              className="min-h-16 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </form>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-foreground">Your todos</h2>
            <p className="text-sm text-muted-foreground">
              {todos.length} item{todos.length === 1 ? "" : "s"}
            </p>
          </div>

          {todos.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card/60 p-8 text-center text-muted-foreground">
              Nothing here yet. Add your first task above.
            </div>
          ) : (
            <ul className="space-y-3">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="rounded-xl border border-border bg-card p-4 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <form action={toggleTodoAction}>
                      <input type="hidden" name="id" value={todo.id} />
                      <input
                        type="hidden"
                        name="completed"
                        value={(!todo.completed).toString()}
                      />
                      <button
                        type="submit"
                        aria-label={todo.completed ? "Mark as active" : "Mark as done"}
                        className={cn(
                          "mt-1 flex h-7 w-7 items-center justify-center rounded-full border text-sm font-semibold transition",
                          todo.completed
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground/50 text-muted-foreground hover:border-primary hover:text-primary",
                        )}
                      >
                        {todo.completed ? "✓" : ""}
                      </button>
                    </form>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <p
                            className={cn(
                              "text-base font-medium text-foreground",
                              todo.completed &&
                                "text-muted-foreground line-through",
                            )}
                          >
                            {todo.title}
                          </p>
                          {todo.description ? (
                            <p className="text-sm text-muted-foreground">
                              {todo.description}
                            </p>
                          ) : null}
                        </div>
                        <form action={deleteTodoAction}>
                          <input type="hidden" name="id" value={todo.id} />
                          <button
                            type="submit"
                            className="text-sm font-medium text-red-600 transition hover:text-red-700"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Added {formatDate(todo.created_at)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}
