#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import mysql from 'mysql2/promise';
import nextEnv from '@next/env';

async function main() {
  const { loadEnvConfig } = nextEnv;
  loadEnvConfig(process.cwd());

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set');
  }

  const migrationsDir = path.join(process.cwd(), 'migrations');
  const migrationFiles = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith('.sql'))
    .sort();

  if (migrationFiles.length === 0) {
    console.log('No migrations to apply.');
    return;
  }

  const connection = await mysql.createConnection({
    uri: databaseUrl,
    ssl: { minVersion: 'TLSv1.2' },
    multipleStatements: true,
  });

  try {
    for (const file of migrationFiles) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      console.log(`Applying migration ${file}...`);
      await connection.query(sql);
    }

    console.log('Migrations applied successfully.');
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
