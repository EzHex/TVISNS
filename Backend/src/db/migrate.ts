import { Pool } from "pg";
import 'dotenv/config';
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

const pool = new Pool({
    host: process.env.DB_HOST ?? 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    user: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME ?? 'postgres',        
});

const db = drizzle(pool);

async function main() {
    console.log('Migration started...');
    await migrate(db, { migrationsFolder: "drizzle"});
    console.log('Migration finished.');
    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});