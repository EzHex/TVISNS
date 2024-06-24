import {integer, pgTable, serial, varchar} from "drizzle-orm/pg-core";
import {users} from "./users";
import {objects} from "./objects";
import {failureStates} from "./failureStates";
import {Pool} from "pg";
import {drizzle} from "drizzle-orm/node-postgres";
import {eq} from "drizzle-orm";
import {apartments} from "./apartments";

export const failures = pgTable("failures", {
  id: serial("id").notNull().primaryKey(),
  description: varchar("description").notNull(),
  failureState: failureStates("failure_state").default("CREATED").notNull(),
  apartmentId: integer("apartment_id").references(() => apartments.id, {onDelete: "cascade"}).notNull(),
  objectId: integer("object_id").references(() => objects.id, {onDelete: "cascade"}).notNull(),
  tenantId: integer("tenant_id").references(() => users.id, {onDelete: "set null"}),
})

export type Failure = typeof failures.$inferSelect;
export type NewFailure = typeof failures.$inferInsert;

const pool = new Pool({
  host: process.env.DB_HOST ?? 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  user: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME ?? 'postgres',
});

const db = drizzle(pool);

export const createFailure = async (newFailure: NewFailure) => {
  return db
    .insert(failures)
    .values(newFailure)
    .returning({
      id: failures.id,
    });
}

export const getFailures = async (apartmentId: number) => {
  return db
    .select()
    .from(failures)
    .where(eq(failures.apartmentId, apartmentId));
}

export const getTenantFailures = async (tenantId: number) => {
  return db
    .select()
    .from(failures)
    .where(eq(failures.tenantId, tenantId));
}

export const getFailure = async (id: number) => {
  return db
    .select()
    .from(failures)
    .where(eq(failures.id, id));
}

export const updateFailure = async (id: number, newFailure: NewFailure) => {
  return db
      .update(failures)
      .set(newFailure)
      .where(eq(failures.id, id))
      .returning({
        id: failures.id,
      });
}

export const deleteFailure = async (id: number) => {
  const f = await getFailure(id)
    if (!f[0]) {
        return;
    }

  return db
      .delete(failures)
      .where(eq(failures.id, id));
}
