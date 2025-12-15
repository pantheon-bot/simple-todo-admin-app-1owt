import Link from "next/link";
import {
  adminUpdateTodoAction,
  deleteTodoAction,
} from "@/app/actions/todos";
import { loginAdmin, logoutAdmin } from "@/app/actions/admin";
import { isAdmin } from "@/lib/admin";
import { listTodos } from "@/lib/todos";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

type SearchParams = Record<string, string | string[] | undefined>;

const STATUS_FILTERS = {
  all: "all",
  open: "open",
  completed: "completed",
} as const;

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const adminSignedIn = await isAdmin();
  const statusParam =
    typeof searchParams?.status === "string" ? searchParams.status : "all";
  const filterStatus =
    statusParam === STATUS_FILTERS.completed
      ? true
      : statusParam === STATUS_FILTERS.open
        ? false
        : undefined;
  const errorKey =
    typeof searchParams?.error === "string" ? searchParams.error : undefined;

  const todos = adminSignedIn ? await listTodos({ completed: filterStatus }) : [];

  if (!adminSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
        <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center gap-8 px-6 py-16">
          <div className="space-y-2 text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Admin access
            </p>
            <h1 className="text-4xl font-semibold text-foreground">
              Sign in to manage todos
            </h1>
            <p className="text-muted-foreground">
              Enter the admin password to edit or remove any todo. Default is
              <span className="font-semibold text-foreground"> &ldquo;admin&rdquo; </span>
              unless overridden by the <code className="text-xs">ADMIN_PASSWORD</code>{" "}
              environment variable.
            </p>
          </div>

          {errorKey ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorKey === "invalid"
                ? "Incorrect password. Try again."
                : "Please enter a password to continue."}
            </div>
          ) : null}

          <form action={loginAdmin} className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
            <label className="space-y-2 text-sm font-medium text-foreground">
              Password
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Sign in
            </button>
            <p className="text-center text-xs text-muted-foreground">
              <Link
                href="/"
                className="font-medium text-primary transition hover:text-primary/80"
              >
                Back to todos
              </Link>
            </p>
          </form>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Admin
            </p>
            <h1 className="text-4xl font-semibold text-foreground">
              Manage every todo
            </h1>
            <p className="text-muted-foreground">
              Edit, filter, and delete todos across the app.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground shadow-sm transition hover:-translate-y-px hover:border-primary hover:text-primary"
            >
              View user list
            </Link>
            <form action={logoutAdmin}>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-white px-3 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:-translate-y-px hover:text-primary"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>

        <form
          method="get"
          className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Filters
            </p>
            <p className="text-sm text-foreground">
              Showing{" "}
              <span className="font-semibold text-primary">
                {statusLabel(statusParam)}
              </span>{" "}
              todos ({todos.length})
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <label className="text-sm font-medium text-foreground">
              Status
              <select
                name="status"
                defaultValue={statusParam in STATUS_FILTERS ? statusParam : "all"}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 sm:w-48"
              >
                <option value="all">All</option>
                <option value="open">Active</option>
                <option value="completed">Completed</option>
              </select>
            </label>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Apply
            </button>
          </div>
        </form>

        <section className="space-y-3">
          {todos.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card/70 p-8 text-center text-muted-foreground">
              No todos match this filter.
            </div>
          ) : (
            <ul className="grid gap-4 lg:grid-cols-2">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-muted-foreground">
                      #{todo.id} • Added {formatDate(todo.created_at)}
                    </p>
                    <form action={deleteTodoAction}>
                      <input type="hidden" name="id" value={todo.id} />
                      <button
                        type="submit"
                        className="text-sm font-semibold text-red-600 transition hover:text-red-700"
                      >
                        Delete
                      </button>
                    </form>
                  </div>

                  <form
                    action={adminUpdateTodoAction}
                    className="space-y-3"
                  >
                    <input type="hidden" name="id" value={todo.id} />
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-foreground">
                        Title
                      </label>
                      <input
                        name="title"
                        defaultValue={todo.title}
                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-foreground">
                        Description
                      </label>
                      <textarea
                        name="description"
                        defaultValue={todo.description ?? ""}
                        className="min-h-20 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="Optional details"
                      />
                    </div>

                    <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <input type="hidden" name="completed" value="false" />
                      <input
                        type="checkbox"
                        name="completed"
                        value="true"
                        defaultChecked={todo.completed}
                        className="h-4 w-4 rounded border border-input text-primary focus:ring-primary/30"
                      />
                      Mark as completed
                      <span
                        className={cn(
                          "ml-auto rounded-full px-2 py-1 text-xs font-semibold",
                          todo.completed
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700",
                        )}
                      >
                        {todo.completed ? "Done" : "In progress"}
                      </span>
                    </label>

                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                      >
                        Save changes
                      </button>
                    </div>
                  </form>
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

function statusLabel(value: string) {
  switch (value) {
    case STATUS_FILTERS.open:
      return "active";
    case STATUS_FILTERS.completed:
      return "completed";
    default:
      return "all";
  }
}
