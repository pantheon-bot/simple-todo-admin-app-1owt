This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Todo app features

- Home page (`/`) to add todos, mark them done, and delete them (all changes persist to TiDB via Kysely).
- Admin page (`/admin`) shows every todo with editing, filtering by status, and delete controls.

## Admin access

- Visit `/admin` and sign in with the admin password.
- Password comes from `ADMIN_PASSWORD`; if unset, the default is `admin` (cookies keep you signed in).

## Database migrations

- Migrations live in `/migrations` as SQL files. Run all migrations with:

  ```bash
  npm run migrate
  ```

- The script loads environment variables with Next.js’ env loader and connects to TiDB over TLS using `DATABASE_URL`.

## Database Configuration

This template uses TiDB Cloud Serverless with the following stack:
- **mysql2** - MySQL client for Node.js with connection pooling
- **Kysely** - Type-safe SQL query builder with full TypeScript support
- **MysqlDialect** - Kysely's MySQL dialect for query generation

The database connection requires TLS 1.2+ for secure communication with TiDB Cloud. See `src/lib/db/db.ts` for the connection configuration.

## Learn More

To learn more about this template, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [TiDB Cloud Starter Documents](https://docs.pingcap.com/tidbcloud/) - learn about TiDB Cloud.
  - [Vector search in TiDB](https://pingcap.github.io/ai/guides/vector-search/#__tabbed_1_2)
- [Kysely](https://kysely.dev/) - the type-safe SQL query builder for TypeScript
- [mysql2](https://github.com/sidorares/node-mysql2) - MySQL client for Node.js
- [shadcn/ui](https://ui.shadcn.com/) - a popular UI library for React.
